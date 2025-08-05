package controllers

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"

	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/storage"

	"mime/multipart"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

var appLogger *slog.Logger

type FileController struct {
	auditService *services.AuditService
}

func NewFileController() *FileController {
	appLogger = config.GetLogger()
	return &FileController{
		auditService: services.NewAuditService(),
	}
}

// UploadFile godoc
// @Summary Upload a file
// @Description Upload a file to the system
// @Tags files
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param file formData file true "File to upload"
// @Param description formData string false "File description"
// @Param tags formData string false "File tags"
// @Param is_public formData bool false "Make file public"
// @Success 201 {object} utils.APIResponse "File uploaded successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 413 {object} utils.APIResponse "File too large"
// @Failure 500 {object} utils.APIResponse "Internal server error"
// @Router /files/upload [post]
func (fc *FileController) UploadFile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Failed to parse form")
		return
	}

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "No file provided")
		return
	}
	defer file.Close()

	if header.Size > 10<<20 {
		utils.ErrorResponse(c, http.StatusRequestEntityTooLarge, "File size exceeds 10MB limit")
		return
	}

	description := c.PostForm("description")
	tags := c.PostForm("tags")
	isPublic := c.PostForm("is_public") == "true"

	fileID := uuid.New()
	fileExtension := filepath.Ext(header.Filename)
	fileName := fileID.String() + fileExtension

	// Read the uploaded file into memory (could be streamed to avoid large memory, but max size is limited)
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to read uploaded file")
		return
	}

	// Upload to configured storage backend
	storageSvc := storage.GetStorage()
	objectKey := filepath.Join(user.ID.String(), fileName) // folder per user
	urlOrPath, err := storageSvc.UploadFile(c.Request.Context(), objectKey, fileBytes, header.Header.Get("Content-Type"))
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to upload file to storage")
		return
	}

	fileModel := models.File{
		UserID:        user.ID,
		FileName:      fileName,
		OriginalName:  header.Filename,
		FilePath:      urlOrPath,
		FileSize:      header.Size,
		MimeType:      header.Header.Get("Content-Type"),
		FileExtension: fileExtension,
		IsPublic:      isPublic,
		Description:   description,
		Tags:          tags,
	}

	if err := database.GetDB().Create(&fileModel).Error; err != nil {
		storageSvc.DeleteFile(c.Request.Context(), objectKey)
		utils.InternalServerErrorResponse(c, "Failed to save file record")
		return
	}

	fc.auditService.LogEvent(&user.ID, models.ActionFileUpload, models.ResourceFile, &fileModel.ID,
		fmt.Sprintf("File uploaded: %s", header.Filename), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusCreated, "File uploaded successfully", fileModel.ToResponse())
}

// UploadMultipleFiles godoc
// @Summary Upload multiple files
// @Description Upload multiple files to the system with concurrent processing
// @Tags files
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param files formData file true "Files to upload"
// @Param description formData string false "File description"
// @Param tags formData string false "File tags"
// @Param is_public formData bool false "Make files public"
// @Param recipients formData string false "Recipients email addresses"
// @Param message formData string false "Message for recipients"
// @Param expiry_days formData int false "Expiry days for share links"
// @Success 201 {object} utils.APIResponse "Files uploaded successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 413 {object} utils.APIResponse "File too large"
// @Failure 500 {object} utils.APIResponse "Internal server error"
// @Router /files/upload-multiple [post]
func (fc *FileController) UploadMultipleFiles(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		appLogger.Error("Failed to parse form", "error", err.Error())
		utils.ErrorResponse(c, http.StatusBadRequest, "Failed to parse form")
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Failed to parse multipart form")
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		utils.ErrorResponse(c, http.StatusBadRequest, "No files provided")
		return
	}

	// Get form data
	description := c.PostForm("description")
	tags := c.PostForm("tags")
	isPublic := c.PostForm("is_public") == "true"
	// recipients := c.PostForm("recipients")
	message := c.PostForm("message")
	// expiryDaysStr := c.PostForm("expiry_days")

	// expiryDays := 7 // default
	// if expiryDaysStr != "" {
	// 	if days, err := strconv.Atoi(expiryDaysStr); err == nil && days > 0 {
	// 		expiryDays = days
	// 	}
	// }

	// Validate file sizes
	for _, file := range files {
		if file.Size > 10<<20 {
			utils.ErrorResponse(c, http.StatusRequestEntityTooLarge, fmt.Sprintf("File %s exceeds 10MB limit", file.Filename))
			return
		}
	}

	// Process files concurrently
	type uploadResult struct {
		File     *models.File
		Error    error
		Filename string
	}

	results := make(chan uploadResult, len(files))
	var wg sync.WaitGroup

	// Start goroutines for concurrent file processing
	for _, fileHeader := range files {
		wg.Add(1)
		go func(header *multipart.FileHeader) {
			defer wg.Done()

			file, err := header.Open()
			if err != nil {
				results <- uploadResult{Error: err, Filename: header.Filename}
				return
			}
			defer file.Close()

			// Read file bytes
			fileBytes, err := io.ReadAll(file)
			if err != nil {
				results <- uploadResult{Error: err, Filename: header.Filename}
				return
			}

			// Generate unique filename
			fileID := uuid.New()
			fileExtension := filepath.Ext(header.Filename)
			fileName := fileID.String() + fileExtension

			// Upload to storage
			storageSvc := storage.GetStorage()
			objectKey := filepath.Join(user.ID.String(), fileName)
			urlOrPath, err := storageSvc.UploadFile(c.Request.Context(), objectKey, fileBytes, header.Header.Get("Content-Type"))
			if err != nil {
				results <- uploadResult{Error: err, Filename: header.Filename}
				return
			}

			// Create file model
			fileModel := &models.File{
				UserID:        user.ID,
				FileName:      fileName,
				OriginalName:  header.Filename,
				FilePath:      urlOrPath,
				FileSize:      header.Size,
				MimeType:      header.Header.Get("Content-Type"),
				FileExtension: fileExtension,
				IsPublic:      isPublic,
				Description:   description,
				Tags:          tags,
			}

			// Save to database
			if err := database.GetDB().Create(fileModel).Error; err != nil {
				storageSvc.DeleteFile(c.Request.Context(), objectKey)
				results <- uploadResult{Error: err, Filename: header.Filename}
				return
			}

			// Log audit event
			fc.auditService.LogEvent(&user.ID, models.ActionFileUpload, models.ResourceFile, &fileModel.ID,
				fmt.Sprintf("File uploaded: %s", header.Filename), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

			results <- uploadResult{File: fileModel, Filename: header.Filename}
		}(fileHeader)
	}

	// Wait for all goroutines to complete
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	var uploadedFiles []models.FileResponse
	var errors []string

	for result := range results {
		if result.Error != nil {
			errors = append(errors, fmt.Sprintf("Failed to upload %s: %v", result.Filename, result.Error))
		} else {
			uploadedFiles = append(uploadedFiles, result.File.ToResponse())
		}
	}

	// Prepare response
	response := gin.H{
		"uploaded_files": uploadedFiles,
		"total_files":    len(files),
		"success_count":  len(uploadedFiles),
		"error_count":    len(errors),
	}

	if len(errors) > 0 {
		response["errors"] = errors
	}

	// Create share links if recipients are provided
	// if recipients != "" && len(uploadedFiles) > 0 {
	// 	storageSvc := storage.GetStorage()
	// 	shareService := services.NewShareService(storageSvc)

	// 	for _, fileResponse := range uploadedFiles {
	// 		// Create share link request
	// 		shareRequest := models.ShareLinkCreateRequest{
	// 			FileID:       fileResponse.ID,
	// 			Description:  message,
	// 			MaxDownloads: 0, // unlimited
	// 		}

	// 		// Set expiry date
	// 		if expiryDays > 0 {
	// 			expiryDate := time.Now().AddDate(0, 0, expiryDays)
	// 			shareRequest.ExpiresAt = &expiryDate
	// 		}

	// 		_, shareErr := shareService.CreateShareLinkWithExpiration(c.Request.Context(), user.ID, fileResponse.ID, shareRequest)
	// 		if shareErr != nil {
	// 			// Log error but don't fail the upload
	// 			fmt.Printf("Failed to create share link for file %s: %v", fileResponse.OriginalName, shareErr)
	// 		}
	// 	}
	// }

	status := http.StatusCreated
	message = fmt.Sprintf("Successfully uploaded %d files", len(uploadedFiles))

	if len(errors) > 0 {
		status = http.StatusPartialContent
		message = fmt.Sprintf("Uploaded %d files with %d errors", len(uploadedFiles), len(errors))
	}

	utils.SuccessResponse(c, status, message, response)
}

// GetFiles godoc
// @Summary Get user files
// @Description Get a paginated list of user's files
// @Tags files
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 10, max: 100)"
// @Param search query string false "Search term for file name or description"
// @Success 200 {object} utils.APIResponse "Files retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /files [get]
func (fc *FileController) GetFiles(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	query := database.GetDB().Where("user_id = ?", user.ID)

	if search != "" {
		query = query.Where("original_name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	var total int64
	query.Model(&models.File{}).Count(&total)

	var files []models.File
	offset := (page - 1) * limit
	if err := query.Preload("User").Offset(offset).Limit(limit).Order("created_at DESC").Find(&files).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve files")
		return
	}

	var responses []models.FileResponse
	for _, file := range files {
		responses = append(responses, file.ToResponse())
	}

	response := gin.H{
		"files": responses,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": (int(total) + limit - 1) / limit,
		},
	}

	utils.SuccessResponse(c, http.StatusOK, "Files retrieved successfully", response)
}

// GetFile godoc
// @Summary Get a specific file
// @Description Get detailed information about a specific file
// @Tags files
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Success 200 {object} utils.APIResponse "File retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /files/{id} [get]
func (fc *FileController) GetFile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	fileID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid file ID")
		return
	}

	var file models.File
	if err := database.GetDB().Preload("User").Where("id = ? AND user_id = ?", fileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "File retrieved successfully", file.ToResponse())
}

// UpdateFile godoc
// @Summary Update file information
// @Description Update file description, tags, or public status
// @Tags files
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Param file body models.FileUpdateRequest true "File update information"
// @Success 200 {object} utils.APIResponse "File updated successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /files/{id} [put]
func (fc *FileController) UpdateFile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	fileID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid file ID")
		return
	}

	var req models.FileUpdateRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	var file models.File
	if err := database.GetDB().Preload("User").Where("id = ? AND user_id = ?", fileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}

	file.Description = req.Description
	file.Tags = req.Tags
	file.IsPublic = req.IsPublic

	if err := database.GetDB().Save(&file).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update file")
		return
	}

	fc.auditService.LogEvent(&user.ID, models.ActionFileUpdate, models.ResourceFile, &file.ID,
		fmt.Sprintf("File updated: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "File updated successfully", file.ToResponse())
}

// DeleteFile godoc
// @Summary Delete a file
// @Description Delete a file and its physical file from disk
// @Tags files
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Success 200 {object} utils.APIResponse "File deleted successfully"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /files/{id} [delete]
func (fc *FileController) DeleteFile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	fileID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid file ID")
		return
	}

	var file models.File
	if err := database.GetDB().Where("id = ? AND user_id = ?", fileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}

	// Delete from storage backend
	storageSvc := storage.GetStorage()
	_ = storageSvc.DeleteFile(c.Request.Context(), filepath.Join(user.ID.String(), file.FileName))

	if err := database.GetDB().Delete(&file).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to delete file record")
		return
	}

	fc.auditService.LogEvent(&user.ID, models.ActionFileDelete, models.ResourceFile, &file.ID,
		fmt.Sprintf("File deleted: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "File deleted successfully", nil)
}

// DownloadFile godoc
// @Summary Download a file
// @Description Download a file by ID
// @Tags files
// @Accept json
// @Produce octet-stream
// @Security BearerAuth
// @Param id path string true "File ID"
// @Success 200 {file} binary "File content"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /files/{id}/download [get]
func (fc *FileController) DownloadFile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	fileID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid file ID")
		return
	}

	var file models.File
	if err := database.GetDB().Where("id = ? AND user_id = ?", fileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}

	// Increment download count
	database.GetDB().Model(&file).Update("download_count", file.DownloadCount+1)

	fc.auditService.LogEvent(&user.ID, models.ActionFileDownload, models.ResourceFile, &file.ID,
		fmt.Sprintf("File downloaded: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	// Serve or redirect depending on storage driver
	if config.AppConfig.Storage.IsS3() {
		// For now, redirect to the S3 object URL stored in FilePath
		c.Redirect(http.StatusTemporaryRedirect, file.FilePath)
		return
	}

	// Local storage – serve file from disk
	if _, err := os.Stat(file.FilePath); os.IsNotExist(err) {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found on disk")
		return
	}

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", file.OriginalName))
	c.Header("Content-Type", file.MimeType)
	c.Header("Content-Length", fmt.Sprintf("%d", file.FileSize))
	c.File(file.FilePath)
}

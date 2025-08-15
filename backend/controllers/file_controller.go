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
	"time"

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
	auditService      *services.AuditService
	fileAccessService *services.FileAccessService
	trashService      *services.TrashService
}

func NewFileController() *FileController {
	appLogger = config.GetLogger()
	return &FileController{
		auditService:      services.NewAuditService(),
		fileAccessService: services.NewFileAccessService(),
		trashService:      services.NewTrashService(),
	}
}

// GetCollaborators returns all collaborators for a file
func (fc *FileController) GetCollaborators(c *gin.Context) {
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
		utils.ErrorResponse(c, http.StatusForbidden, "Only the owner can get collaborators")
		return
	}

	var collaborators []models.Collaborator
	if err := database.GetDB().Where("file_id = ?", fileID).Find(&collaborators).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to get collaborators")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Collaborators fetched successfully", collaborators)
}

// AddCollaborator adds a collaborator to a file with a specific role
func (fc *FileController) AddCollaborator(c *gin.Context) {
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

	// Ensure requester is owner
	var file models.File
	if err := database.GetDB().Where("id = ? AND user_id = ?", fileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusForbidden, "Only the owner can add collaborators")
		return
	}

	var req models.AddCollaboratorRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	collab := models.Collaborator{
		FileID:    &file.ID,
		UserID:    req.UserID,
		Role:      req.Role,
		ExpiresAt: req.ExpiresAt,
	}

	if err := database.GetDB().Where("file_id = ? AND user_id = ?", file.ID, req.UserID).Assign(collab).FirstOrCreate(&collab).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to add collaborator")
		return
	}

	// Load user for response
	database.GetDB().Preload("User").First(&collab, collab.ID)

	utils.SuccessResponse(c, http.StatusCreated, "Collaborator added", collab.ToResponse())
}

// UpdateCollaborator updates role or expiration for a collaborator
func (fc *FileController) UpdateCollaborator(c *gin.Context) {
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

	// Ensure requester is owner
	var file models.File
	if err := database.GetDB().Where("id = ? AND user_id = ?", fileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusForbidden, "Only the owner can update collaborators")
		return
	}

	collaboratorID, err := uuid.Parse(c.Param("collaboratorId"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid collaborator ID")
		return
	}

	var req models.UpdateCollaboratorRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	var collab models.Collaborator
	if err := database.GetDB().Where("file_id = ? AND user_id = ?", file.ID, collaboratorID).First(&collab).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Collaborator not found")
		return
	}

	if req.Role != "" {
		collab.Role = req.Role
	}
	collab.ExpiresAt = req.ExpiresAt

	if err := database.GetDB().Save(&collab).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update collaborator")
		return
	}

	database.GetDB().Preload("User").First(&collab, collab.ID)
	utils.SuccessResponse(c, http.StatusOK, "Collaborator updated", collab.ToResponse())
}

// RemoveCollaborator removes a collaborator from a file
func (fc *FileController) RemoveCollaborator(c *gin.Context) {
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

	// Ensure requester is owner
	var file models.File
	if err := database.GetDB().Where("id = ? AND user_id = ?", fileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusForbidden, "Only the owner can remove collaborators")
		return
	}

	collaboratorID, err := uuid.Parse(c.Param("collaboratorId"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid collaborator ID")
		return
	}

	if err := database.GetDB().Where("file_id = ? AND user_id = ?", file.ID, collaboratorID).Delete(&models.Collaborator{}).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to remove collaborator")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Collaborator removed", nil)
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

	// Update ACL based on visibility
	if err := storageSvc.SetObjectPublic(c.Request.Context(), objectKey, isPublic); err != nil {
		// Best-effort: log but don't fail the request, we can still store as private
		appLogger.Error("Failed to set object ACL", "key", objectKey, "error", err)
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
	folderIDStr := c.PostForm("folder_id")
	// expiryDaysStr := c.PostForm("expiry_days")
	var folderID *uuid.UUID
	// expiryDays := 7 // default
	// if expiryDaysStr != "" {
	// 	if days, err := strconv.Atoi(expiryDaysStr); err == nil && days > 0 {
	// 		expiryDays = days
	// 	}
	// }
	// validate folder id
	if folderIDStr != "" {
		var folder models.Folder
		if err := database.GetDB().Where("id = ? AND user_id = ?", folderIDStr, user.ID).First(&folder).Error; err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid folder ID")
			return
		}
		folderID = &folder.ID
	}

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
				FolderID:      folderID,
			}

			// Save to database
			if err := database.GetDB().Create(fileModel).Error; err != nil {
				storageSvc.DeleteFile(c.Request.Context(), objectKey)
				results <- uploadResult{Error: err, Filename: header.Filename}
				return
			}

			// Update ACL based on visibility
			if err := storageSvc.SetObjectPublic(c.Request.Context(), objectKey, isPublic); err != nil {
				appLogger.Error("Failed to set object ACL", "key", objectKey, "error", err)
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

	// Owner files or collaborator files (exclude trashed items)
	query := database.GetDB().Model(&models.File{}).
		Joins("LEFT JOIN file_permissions ON files.id = file_permissions.file_id").
		Where("(files.user_id = ? OR file_permissions.user_id = ?) AND files.is_trashed = false", user.ID, user.ID)

	if search != "" {
		query = query.Where("original_name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	var total int64
	// Use subquery to count distinct files (exclude trashed items)
	countQuery := database.GetDB().Model(&models.File{}).
		Joins("LEFT JOIN file_permissions ON files.id = file_permissions.file_id").
		Where("(files.user_id = ? OR file_permissions.user_id = ?) AND files.is_trashed = false", user.ID, user.ID)

	if search != "" {
		countQuery = countQuery.Where("original_name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	countQuery.Distinct("files.id").Count(&total)

	var files []models.File
	offset := (page - 1) * limit

	// Use subquery to get distinct file IDs with proper ordering
	subquery := database.GetDB().Model(&models.File{}).
		Select("DISTINCT files.id, files.created_at").
		Joins("LEFT JOIN file_permissions ON files.id = file_permissions.file_id").
		Where("files.user_id = ? OR file_permissions.user_id = ?", user.ID, user.ID)

	if search != "" {
		subquery = subquery.Where("original_name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	subquery = subquery.Order("files.created_at DESC").Offset(offset).Limit(limit)

	// Get the actual files using the subquery
	if err := database.GetDB().Model(&models.File{}).
		Preload("User").
		Where("files.id IN (?)", subquery.Select("files.id")).
		Order("files.created_at DESC").
		Find(&files).Error; err != nil {
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
	if err := database.GetDB().Preload("User").Where("id = ?", fileID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}
	if file.UserID != user.ID {
		var perm models.Collaborator
		err := database.GetDB().Where("file_id = ? AND user_id = ?", file.ID, user.ID).First(&perm).Error
		if err != nil || perm.IsExpired() {
			utils.ErrorResponse(c, http.StatusForbidden, "You do not have access to this file")
			return
		}
	}

	// Track file access (view)
	fc.fileAccessService.LogFileAccess(user.ID, file.ID, models.ActionView)

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
		utils.ErrorResponse(c, http.StatusNotFound, "File not found or you are not the owner")
		return
	}

	file.Description = req.Description
	file.Tags = req.Tags
	file.IsPublic = req.IsPublic

	if err := database.GetDB().Save(&file).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update file")
		return
	}

	// Update ACL on storage to reflect new public/private status
	objectKey := filepath.Join(user.ID.String(), file.FileName)
	storageSvc := storage.GetStorage()
	if err := storageSvc.SetObjectPublic(c.Request.Context(), objectKey, file.IsPublic); err != nil {
		appLogger.Error("Failed to update object ACL on update", "key", objectKey, "error", err)
	}

	fc.auditService.LogEvent(&user.ID, models.ActionFileUpdate, models.ResourceFile, &file.ID,
		fmt.Sprintf("File updated: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "File updated successfully", file.ToResponse())
}

// GeneratePresignedURL godoc
// @Summary Generate a pre-signed download URL for a file
// @Description Returns a time-limited pre-signed URL to download the file
// @Tags files
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Param expiration query int false "Expiration in minutes (default 15)"
// @Success 200 {object} utils.APIResponse "Presigned URL generated"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /files/{id}/presigned-url [post]
func (fc *FileController) GeneratePresignedURL(c *gin.Context) {
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
	// Allow if requester is owner OR has a non-expired collaborator permission
	if err := database.GetDB().Where("id = ?", fileID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}
	if file.UserID != user.ID {
		// not owner, check collaborator permission
		var perm models.Collaborator
		err := database.GetDB().Where("file_id = ? AND user_id = ?", file.ID, user.ID).First(&perm).Error
		if err != nil || perm.IsExpired() {
			utils.ErrorResponse(c, http.StatusForbidden, "You do not have access to this file")
			return
		}
	}

	// Default expiration 15 minutes
	expMinutes, _ := strconv.Atoi(c.DefaultQuery("expiration", "15"))
	if expMinutes <= 0 || expMinutes > 1440 {
		expMinutes = 15
	}

	storageSvc := storage.GetStorage()
	objectKey := filepath.Join(user.ID.String(), file.FileName)

	url, err := storageSvc.GeneratePresignedURL(c.Request.Context(), objectKey, time.Duration(expMinutes)*time.Minute)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate presigned URL")
		return
	}

	// Track file access
	fc.fileAccessService.LogFileAccess(user.ID, file.ID, models.ActionView)

	fc.auditService.LogEvent(&user.ID, models.ActionFileDownload, models.ResourceFile, &file.ID,
		fmt.Sprintf("Generated presigned URL for: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Presigned URL generated", gin.H{
		"download_url":       url,
		"expires_in_minutes": expMinutes,
	})
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

	// Move to trash instead of permanently deleting
	if err := fc.trashService.MoveFileToTrash(user.ID, fileID); err != nil {
		utils.InternalServerErrorResponse(c, "Failed to move file to trash")
		return
	}

	fc.auditService.LogEvent(&user.ID, models.ActionFileDelete, models.ResourceFile, &file.ID,
		fmt.Sprintf("File moved to trash: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "File moved to trash successfully", nil)
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
	if err := database.GetDB().Where("id = ?", fileID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}
	if file.UserID != user.ID {
		var perm models.Collaborator
		err := database.GetDB().Where("file_id = ? AND user_id = ?", file.ID, user.ID).First(&perm).Error
		if err != nil || perm.IsExpired() {
			utils.ErrorResponse(c, http.StatusForbidden, "You do not have access to this file")
			return
		}
	}

	// Increment download count
	database.GetDB().Model(&file).Update("download_count", file.DownloadCount+1)

	// Track file access
	fc.fileAccessService.LogFileAccess(user.ID, file.ID, models.ActionDownload)

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

// GetRecentFiles godoc
// @Summary Get recently accessed files
// @Description Get a list of files recently accessed by the user
// @Tags files
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param limit query int false "Number of recent files to return (default: 20, max: 100)"
// @Success 200 {object} utils.APIResponse "Recent files retrieved successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /files/recent [get]
func (fc *FileController) GetRecentFiles(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if limit < 1 || limit > 100 {
		limit = 20
	}

	accesses, err := fc.fileAccessService.GetRecentFiles(user.ID, limit)
	if err != nil {
		appLogger.Error("Failed to get recent files", "error", err, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to retrieve recent files")
		return
	}

	var responses []models.FileAccessResponse
	for _, access := range accesses {
		responses = append(responses, access.ToResponse())
	}

	utils.SuccessResponse(c, http.StatusOK, "Recent files retrieved successfully", gin.H{
		"recent_files": responses,
		"total":        len(responses),
	})
}

// GetFileAccessHistory godoc
// @Summary Get file access history
// @Description Get access history for a specific file
// @Tags files
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Param limit query int false "Number of access records to return (default: 50, max: 200)"
// @Success 200 {object} utils.APIResponse "File access history retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /files/{id}/history [get]
func (fc *FileController) GetFileAccessHistory(c *gin.Context) {
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

	// Check if user has access to the file
	var file models.File
	if err := database.GetDB().Where("id = ?", fileID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}

	if file.UserID != user.ID {
		var perm models.Collaborator
		err := database.GetDB().Where("file_id = ? AND user_id = ?", file.ID, user.ID).First(&perm).Error
		if err != nil || perm.IsExpired() {
			utils.ErrorResponse(c, http.StatusForbidden, "You do not have access to this file")
			return
		}
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	if limit < 1 || limit > 200 {
		limit = 50
	}

	accesses, err := fc.fileAccessService.GetFileAccessHistory(fileID, limit)
	if err != nil {
		appLogger.Error("Failed to get file access history", "error", err, "file_id", fileID)
		utils.InternalServerErrorResponse(c, "Failed to retrieve file access history")
		return
	}

	var responses []models.FileAccessResponse
	for _, access := range accesses {
		responses = append(responses, access.ToResponse())
	}

	utils.SuccessResponse(c, http.StatusOK, "File access history retrieved successfully", gin.H{
		"access_history": responses,
		"total":          len(responses),
		"file":           file.ToResponse(),
	})
}

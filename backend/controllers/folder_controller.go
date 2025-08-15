package controllers

import (
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

type FolderController struct {
	auditService *services.AuditService
	trashService *services.TrashService
	logger       *slog.Logger
}

func NewFolderController() *FolderController {
	return &FolderController{
		auditService: services.NewAuditService(),
		trashService: services.NewTrashService(),
		logger:       config.GetLogger(),
	}
}

// CreateFolder godoc
// @Summary Create a new folder
// @Description Create a new folder in the specified parent folder
// @Tags folders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param folder body models.FolderCreateRequest true "Folder creation data"
// @Success 201 {object} utils.APIResponse "Folder created successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 409 {object} utils.APIResponse "Folder already exists"
// @Router /folders [post]
func (fc *FolderController) CreateFolder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	var req models.FolderCreateRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	// Check if parent folder exists and user has access
	if req.ParentID != nil {
		var parentFolder models.Folder
		if err := database.GetDB().Where("id = ? AND user_id = ?", *req.ParentID, user.ID).First(&parentFolder).Error; err != nil {
			utils.ErrorResponse(c, http.StatusNotFound, "Parent folder not found or access denied")
			return
		}
	}

	// Check if folder with same name already exists in the same parent
	var existingFolder models.Folder
	query := database.GetDB().Where("user_id = ? AND name = ?", user.ID, req.Name)
	if req.ParentID != nil {
		query = query.Where("parent_id = ?", *req.ParentID)
	} else {
		query = query.Where("parent_id IS NULL")
	}

	if err := query.First(&existingFolder).Error; err == nil {
		utils.ErrorResponse(c, http.StatusConflict, "Folder with this name already exists")
		return
	}

	folder := models.Folder{
		UserID:   user.ID,
		ParentID: req.ParentID,
		Name:     req.Name,
		Color:    req.Color,
	}

	if err := database.GetDB().Create(&folder).Error; err != nil {
		fc.logger.Error("Failed to create folder", "error", err, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to create folder")
		return
	}

	// Load the folder with user relationship for response
	database.GetDB().Preload("User").First(&folder, folder.ID)

	fc.auditService.LogEvent(&user.ID, models.ActionFolderCreate, models.ResourceFolder, &folder.ID,
		fmt.Sprintf("Folder created: %s", folder.Name), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusCreated, "Folder created successfully", folder.ToResponse())
}

// GetFolders godoc
// @Summary Get folders and files in a directory
// @Description Get a paginated list of folders and files in the specified directory
// @Tags folders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param parent_id query string false "Parent folder ID (empty for root)"
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 20, max: 100)"
// @Param search query string false "Search term for folder/file names"
// @Success 200 {object} utils.APIResponse "Directory contents retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /folders [get]
func (fc *FolderController) GetFolders(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")
	parentIDStr := c.Query("parent_id")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	var parentID *uuid.UUID
	if parentIDStr != "" {
		parsed, err := uuid.Parse(parentIDStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid parent_id format")
			return
		}
		parentID = &parsed

		// Verify user has access to parent folder
		var parentFolder models.Folder
		if err := database.GetDB().Where("id = ? AND user_id = ?", *parentID, user.ID).First(&parentFolder).Error; err != nil {
			utils.ErrorResponse(c, http.StatusNotFound, "Parent folder not found or access denied")
			return
		}
	}

	// Build query for folders (exclude trashed items)
	folderQuery := database.GetDB().Model(&models.Folder{}).Where("user_id = ? AND is_trashed = false", user.ID)
	if parentID != nil {
		folderQuery = folderQuery.Where("parent_id = ?", *parentID)
	} else {
		folderQuery = folderQuery.Where("parent_id IS NULL")
	}

	if search != "" {
		folderQuery = folderQuery.Where("name LIKE ?", "%"+search+"%")
	}

	// Build query for files (exclude trashed items)
	fileQuery := database.GetDB().Model(&models.File{}).Where("user_id = ? AND is_trashed = false", user.ID)
	if parentID != nil {
		fileQuery = fileQuery.Where("folder_id = ?", *parentID)
	} else {
		fileQuery = fileQuery.Where("folder_id IS NULL")
	}

	if search != "" {
		fileQuery = fileQuery.Where("original_name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Count totals
	var totalFolders, totalFiles int64
	folderQuery.Count(&totalFolders)
	fileQuery.Count(&totalFiles)

	// Get folders
	var folders []models.Folder
	offset := (page - 1) * limit
	folderQuery.Preload("User").Order("name ASC").Offset(offset).Limit(limit).Find(&folders)

	// Get files (remaining space in the limit)
	var files []models.File
	remainingLimit := limit - len(folders)
	if remainingLimit > 0 {
		fileQuery.Preload("User").Preload("Folder").Order("original_name ASC").Offset(offset).Limit(remainingLimit).Find(&files)
	}

	// Convert to response format
	var folderResponses []models.FolderResponse
	for _, folder := range folders {
		// Get counts for each folder
		var fileCount, subfolderCount int64
		database.GetDB().Model(&models.File{}).Where("folder_id = ?", folder.ID).Count(&fileCount)
		database.GetDB().Model(&models.Folder{}).Where("parent_id = ?", folder.ID).Count(&subfolderCount)

		response := folder.ToResponse()
		response.FileCount = fileCount
		response.SubfolderCount = subfolderCount
		folderResponses = append(folderResponses, response)
	}

	var fileResponses []models.FileResponse
	for _, file := range files {
		fileResponses = append(fileResponses, file.ToResponse())
	}

	// Get breadcrumbs if we're in a subfolder
	var breadcrumbs []models.Breadcrumb
	if parentID != nil {
		var currentFolder models.Folder
		if err := database.GetDB().Where("id = ?", *parentID).First(&currentFolder).Error; err == nil {
			breadcrumbs, _ = currentFolder.GetBreadcrumbs(database.GetDB())
		}
	}

	response := gin.H{
		"folders": folderResponses,
		"files":   fileResponses,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       totalFolders + totalFiles,
			"total_pages": int((totalFolders + totalFiles + int64(limit) - 1) / int64(limit)),
		},
		"breadcrumbs": breadcrumbs,
		"parent_id":   parentID,
	}

	utils.SuccessResponse(c, http.StatusOK, "Directory contents retrieved successfully", response)
}

// GetFolder godoc
// @Summary Get a specific folder
// @Description Get detailed information about a specific folder
// @Tags folders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Folder ID"
// @Success 200 {object} utils.APIResponse "Folder retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Invalid folder ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Folder not found"
// @Router /folders/{id} [get]
func (fc *FolderController) GetFolder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	folderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid folder ID")
		return
	}

	var folder models.Folder
	if err := database.GetDB().Preload("User").Where("id = ? AND user_id = ?", folderID, user.ID).First(&folder).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Folder not found")
		return
	}

	// Get counts
	var fileCount, subfolderCount int64
	database.GetDB().Model(&models.File{}).Where("folder_id = ?", folder.ID).Count(&fileCount)
	database.GetDB().Model(&models.Folder{}).Where("parent_id = ?", folder.ID).Count(&subfolderCount)

	response := folder.ToResponse()
	response.FileCount = fileCount
	response.SubfolderCount = subfolderCount

	utils.SuccessResponse(c, http.StatusOK, "Folder retrieved successfully", response)
}

// UpdateFolder godoc
// @Summary Update folder information
// @Description Update folder name and color
// @Tags folders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Folder ID"
// @Param folder body models.FolderUpdateRequest true "Folder update information"
// @Success 200 {object} utils.APIResponse "Folder updated successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Folder not found"
// @Router /folders/{id} [put]
func (fc *FolderController) UpdateFolder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	folderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid folder ID")
		return
	}

	var req models.FolderUpdateRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	var folder models.Folder
	if err := database.GetDB().Where("id = ? AND user_id = ?", folderID, user.ID).First(&folder).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Folder not found")
		return
	}

	// Check if folder with same name already exists in the same parent (excluding current folder)
	var existingFolder models.Folder
	query := database.GetDB().Where("user_id = ? AND name = ? AND id != ?", user.ID, req.Name, folder.ID)
	if folder.ParentID != nil {
		query = query.Where("parent_id = ?", *folder.ParentID)
	} else {
		query = query.Where("parent_id IS NULL")
	}

	if err := query.First(&existingFolder).Error; err == nil {
		utils.ErrorResponse(c, http.StatusConflict, "Folder with this name already exists")
		return
	}

	folder.Name = req.Name
	folder.Color = req.Color

	if err := database.GetDB().Save(&folder).Error; err != nil {
		fc.logger.Error("Failed to update folder", "error", err, "folder_id", folder.ID)
		utils.InternalServerErrorResponse(c, "Failed to update folder")
		return
	}

	database.GetDB().Preload("User").First(&folder, folder.ID)

	fc.auditService.LogEvent(&user.ID, models.ActionFolderUpdate, models.ResourceFolder, &folder.ID,
		fmt.Sprintf("Folder updated: %s", folder.Name), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Folder updated successfully", folder.ToResponse())
}

// MoveFolder godoc
// @Summary Move folder to a different parent
// @Description Move a folder to a different parent folder
// @Tags folders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Folder ID"
// @Param move body models.FolderMoveRequest true "Move operation data"
// @Success 200 {object} utils.APIResponse "Folder moved successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Folder not found"
// @Router /folders/{id}/move [post]
func (fc *FolderController) MoveFolder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	folderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid folder ID")
		return
	}

	var req models.FolderMoveRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	var folder models.Folder
	if err := database.GetDB().Where("id = ? AND user_id = ?", folderID, user.ID).First(&folder).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Folder not found")
		return
	}

	// Check if destination parent exists and user has access
	if req.ParentID != nil {
		var parentFolder models.Folder
		if err := database.GetDB().Where("id = ? AND user_id = ?", *req.ParentID, user.ID).First(&parentFolder).Error; err != nil {
			utils.ErrorResponse(c, http.StatusNotFound, "Destination folder not found or access denied")
			return
		}

		// Prevent moving folder into itself or its descendants
		if *req.ParentID == folder.ID {
			utils.ErrorResponse(c, http.StatusBadRequest, "Cannot move folder into itself")
			return
		}

		// Check if it would create a cycle (moving into a descendant)
		var descendants []models.Folder
		database.GetDB().Where("path LIKE ?", folder.Path+"/%").Find(&descendants)
		for _, desc := range descendants {
			if desc.ID == *req.ParentID {
				utils.ErrorResponse(c, http.StatusBadRequest, "Cannot move folder into its descendant")
				return
			}
		}
	}

	// Check if folder with same name already exists in destination
	var existingFolder models.Folder
	query := database.GetDB().Where("user_id = ? AND name = ? AND id != ?", user.ID, folder.Name, folder.ID)
	if req.ParentID != nil {
		query = query.Where("parent_id = ?", *req.ParentID)
	} else {
		query = query.Where("parent_id IS NULL")
	}

	if err := query.First(&existingFolder).Error; err == nil {
		utils.ErrorResponse(c, http.StatusConflict, "Folder with this name already exists in destination")
		return
	}

	folder.ParentID = req.ParentID

	if err := database.GetDB().Save(&folder).Error; err != nil {
		fc.logger.Error("Failed to move folder", "error", err, "folder_id", folder.ID)
		utils.InternalServerErrorResponse(c, "Failed to move folder")
		return
	}

	fc.auditService.LogEvent(&user.ID, models.ActionFolderMove, models.ResourceFolder, &folder.ID,
		fmt.Sprintf("Folder moved: %s", folder.Name), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Folder moved successfully", folder.ToResponse())
}

// DeleteFolder godoc
// @Summary Delete a folder
// @Description Delete a folder and all its contents
// @Tags folders
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Folder ID"
// @Success 200 {object} utils.APIResponse "Folder deleted successfully"
// @Failure 400 {object} utils.APIResponse "Invalid folder ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Folder not found"
// @Router /folders/{id} [delete]
func (fc *FolderController) DeleteFolder(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	folderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid folder ID")
		return
	}

	var folder models.Folder
	if err := database.GetDB().Where("id = ? AND user_id = ?", folderID, user.ID).First(&folder).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Folder not found")
		return
	}

	// Move folder and all its contents to trash instead of permanently deleting
	if err := fc.trashService.MoveFolderToTrash(user.ID, folderID); err != nil {
		fc.logger.Error("Failed to move folder to trash", "error", err, "folder_id", folder.ID)
		utils.InternalServerErrorResponse(c, "Failed to move folder to trash")
		return
	}

	fc.auditService.LogEvent(&user.ID, models.ActionFolderDelete, models.ResourceFolder, &folder.ID,
		fmt.Sprintf("Folder moved to trash: %s", folder.Name), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Folder moved to trash successfully", nil)
}

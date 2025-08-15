package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

type TrashController struct {
	trashService *services.TrashService
	auditService *services.AuditService
}

func NewTrashController() *TrashController {
	return &TrashController{
		trashService: services.NewTrashService(),
		auditService: services.NewAuditService(),
	}
}

// GetTrashedItems godoc
// @Summary Get all trashed items
// @Description Get all files and folders in trash for the current user
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 20, max: 100)"
// @Success 200 {object} utils.APIResponse "Trashed items retrieved successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /trash [get]
func (tc *TrashController) GetTrashedItems(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	trashedItems, err := tc.trashService.GetTrashedItems(user.ID, page, limit)
	if err != nil {
		config.GetLogger().Error("Failed to get trashed items", "error", err, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to retrieve trashed items")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Trashed items retrieved successfully", trashedItems)
}

// MoveFileToTrash godoc
// @Summary Move file to trash
// @Description Move a file to trash (soft delete)
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Success 200 {object} utils.APIResponse "File moved to trash successfully"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /trash/files/{id} [post]
func (tc *TrashController) MoveFileToTrash(c *gin.Context) {
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

	if err := tc.trashService.MoveFileToTrash(user.ID, fileID); err != nil {
		config.GetLogger().Error("Failed to move file to trash", "error", err, "file_id", fileID, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to move file to trash")
		return
	}

	tc.auditService.LogEvent(&user.ID, models.ActionFileDelete, models.ResourceFile, &fileID,
		"File moved to trash", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "File moved to trash successfully", nil)
}

// MoveFolderToTrash godoc
// @Summary Move folder to trash
// @Description Move a folder and all its contents to trash (soft delete)
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Folder ID"
// @Success 200 {object} utils.APIResponse "Folder moved to trash successfully"
// @Failure 400 {object} utils.APIResponse "Invalid folder ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Folder not found"
// @Router /trash/folders/{id} [post]
func (tc *TrashController) MoveFolderToTrash(c *gin.Context) {
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

	if err := tc.trashService.MoveFolderToTrash(user.ID, folderID); err != nil {
		config.GetLogger().Error("Failed to move folder to trash", "error", err, "folder_id", folderID, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to move folder to trash")
		return
	}

	tc.auditService.LogEvent(&user.ID, models.ActionFolderDelete, models.ResourceFolder, &folderID,
		"Folder moved to trash", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Folder moved to trash successfully", nil)
}

// RestoreFile godoc
// @Summary Restore file from trash
// @Description Restore a file from trash
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Success 200 {object} utils.APIResponse "File restored successfully"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found in trash"
// @Router /trash/files/{id}/restore [post]
func (tc *TrashController) RestoreFile(c *gin.Context) {
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

	if err := tc.trashService.RestoreFileFromTrash(user.ID, fileID); err != nil {
		config.GetLogger().Error("Failed to restore file from trash", "error", err, "file_id", fileID, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to restore file from trash")
		return
	}

	tc.auditService.LogEvent(&user.ID, "file_restore", models.ResourceFile, &fileID,
		"File restored from trash", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "File restored successfully", nil)
}

// RestoreFolder godoc
// @Summary Restore folder from trash
// @Description Restore a folder and all its contents from trash
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Folder ID"
// @Success 200 {object} utils.APIResponse "Folder restored successfully"
// @Failure 400 {object} utils.APIResponse "Invalid folder ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Folder not found in trash"
// @Router /trash/folders/{id}/restore [post]
func (tc *TrashController) RestoreFolder(c *gin.Context) {
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

	if err := tc.trashService.RestoreFolderFromTrash(user.ID, folderID); err != nil {
		config.GetLogger().Error("Failed to restore folder from trash", "error", err, "folder_id", folderID, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to restore folder from trash")
		return
	}

	tc.auditService.LogEvent(&user.ID, "folder_restore", models.ResourceFolder, &folderID,
		"Folder restored from trash", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Folder restored successfully", nil)
}

// PermanentlyDeleteFile godoc
// @Summary Permanently delete file
// @Description Permanently delete a file from trash (cannot be undone)
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "File ID"
// @Success 200 {object} utils.APIResponse "File permanently deleted"
// @Failure 400 {object} utils.APIResponse "Invalid file ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found in trash"
// @Router /trash/files/{id}/permanent [delete]
func (tc *TrashController) PermanentlyDeleteFile(c *gin.Context) {
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

	if err := tc.trashService.PermanentlyDeleteFile(user.ID, fileID); err != nil {
		config.GetLogger().Error("Failed to permanently delete file", "error", err, "file_id", fileID, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to permanently delete file")
		return
	}

	tc.auditService.LogEvent(&user.ID, "file_permanent_delete", models.ResourceFile, &fileID,
		"File permanently deleted", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "File permanently deleted", nil)
}

// PermanentlyDeleteFolder godoc
// @Summary Permanently delete folder
// @Description Permanently delete a folder and all its contents from trash (cannot be undone)
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Folder ID"
// @Success 200 {object} utils.APIResponse "Folder permanently deleted"
// @Failure 400 {object} utils.APIResponse "Invalid folder ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Folder not found in trash"
// @Router /trash/folders/{id}/permanent [delete]
func (tc *TrashController) PermanentlyDeleteFolder(c *gin.Context) {
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

	if err := tc.trashService.PermanentlyDeleteFolder(user.ID, folderID); err != nil {
		config.GetLogger().Error("Failed to permanently delete folder", "error", err, "folder_id", folderID, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to permanently delete folder")
		return
	}

	tc.auditService.LogEvent(&user.ID, "folder_permanent_delete", models.ResourceFolder, &folderID,
		"Folder permanently deleted", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Folder permanently deleted", nil)
}

// EmptyTrash godoc
// @Summary Empty trash
// @Description Permanently delete all items in trash (cannot be undone)
// @Tags trash
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.APIResponse "Trash emptied successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /trash/empty [delete]
func (tc *TrashController) EmptyTrash(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	if err := tc.trashService.EmptyTrash(user.ID); err != nil {
		config.GetLogger().Error("Failed to empty trash", "error", err, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to empty trash")
		return
	}

	tc.auditService.LogEvent(&user.ID, "trash_empty", "trash", nil,
		"Trash emptied", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Trash emptied successfully", nil)
}

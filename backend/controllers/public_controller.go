package controllers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

type PublicController struct {
	auditService *services.AuditService
}

func NewPublicController() *PublicController {
	return &PublicController{
		auditService: services.NewAuditService(),
	}
}

// AccessShareLink godoc
// @Summary Access a shared file
// @Description Access a shared file using a share token
// @Tags public
// @Accept json
// @Produce json
// @Param token path string true "Share token"
// @Param password formData string false "Share link password (if required)"
// @Success 200 {object} utils.APIResponse "Share link accessed successfully"
// @Failure 400 {object} utils.APIResponse "Share token is required"
// @Failure 401 {object} utils.APIResponse "Password required or invalid"
// @Failure 403 {object} utils.APIResponse "Share link not accessible"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /public/share/{token} [get]
func (pc *PublicController) AccessShareLink(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Share token is required")
		return
	}

	var shareLink models.ShareLink
	if err := database.GetDB().Where("token = ?", token).Preload("File.User").Preload("User").First(&shareLink).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		return
	}

	// Check if share link is accessible
	if !shareLink.IsAccessible() {
		utils.ErrorResponse(c, http.StatusForbidden, "Share link is not accessible")
		return
	}

	// Check if password is required
	if shareLink.Password != "" {
		password := c.PostForm("password")
		if password == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Password required for this share link")
			return
		}
		if !shareLink.CheckPassword(password) {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid password")
			return
		}
	}

	// Get user from context if available
	userID, _ := middleware.GetUserIDFromContext(c)

	// Log access event
	if userID != uuid.Nil {
		pc.auditService.LogEvent(&userID, models.ActionShareAccess, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Share link accessed: %s", shareLink.File.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	} else {
		pc.auditService.LogEvent(nil, models.ActionShareAccess, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Share link accessed: %s", shareLink.File.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	}

	utils.SuccessResponse(c, http.StatusOK, "Share link accessed successfully", shareLink.ToResponse())
}

// DownloadSharedFile godoc
// @Summary Download a shared file
// @Description Download a file from a share link
// @Tags public
// @Accept json
// @Produce octet-stream
// @Param token path string true "Share token"
// @Param password formData string false "Share link password (if required)"
// @Success 200 {file} binary "File content"
// @Failure 400 {object} utils.APIResponse "Share token is required"
// @Failure 401 {object} utils.APIResponse "Password required or invalid"
// @Failure 403 {object} utils.APIResponse "Share link not accessible"
// @Failure 404 {object} utils.APIResponse "Share link or file not found"
// @Router /public/share/{token}/download [post]
func (pc *PublicController) DownloadSharedFile(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Share token is required")
		return
	}

	var shareLink models.ShareLink
	if err := database.GetDB().Where("token = ?", token).Preload("File.User").Preload("User").First(&shareLink).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		return
	}

	// Check if share link is accessible
	if !shareLink.IsAccessible() {
		utils.ErrorResponse(c, http.StatusForbidden, "Share link is not accessible")
		return
	}

	// Check if password is required
	if shareLink.Password != "" {
		password := c.PostForm("password")
		if password == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Password required for this share link")
			return
		}
		if !shareLink.CheckPassword(password) {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid password")
			return
		}
	}

	// Check if file exists on disk
	if _, err := os.Stat(shareLink.File.FilePath); os.IsNotExist(err) {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found on disk")
		return
	}

	// Increment download counts
	database.GetDB().Model(&shareLink).Update("download_count", shareLink.DownloadCount+1)
	database.GetDB().Model(&shareLink.File).Update("download_count", shareLink.File.DownloadCount+1)

	// Get user from context if available
	userID, _ := middleware.GetUserIDFromContext(c)

	// Log download event
	if userID != uuid.Nil {
		pc.auditService.LogEvent(&userID, models.ActionFileDownload, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Shared file downloaded: %s", shareLink.File.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	} else {
		pc.auditService.LogEvent(nil, models.ActionFileDownload, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Shared file downloaded: %s", shareLink.File.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	}

	// Set headers for file download
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", shareLink.File.OriginalName))
	c.Header("Content-Type", shareLink.File.MimeType)
	c.Header("Content-Length", fmt.Sprintf("%d", shareLink.File.FileSize))

	// Serve the file
	c.File(shareLink.File.FilePath)
}

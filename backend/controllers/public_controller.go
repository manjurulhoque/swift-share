package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/storage"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

type PublicController struct {
	auditService *services.AuditService
	shareService *services.ShareService
}

func NewPublicController() *PublicController {
	storageService := storage.GetStorage()
	shareService := services.NewShareService(storageService)

	return &PublicController{
		auditService: services.NewAuditService(),
		shareService: shareService,
	}
}

// AccessShareLink godoc
// @Summary Access a shared file
// @Description Access a shared file using a share token
// @Tags public
// @Accept json
// @Produce json
// @Param token path string true "Share token"
// @Param password query string false "Share link password (if required)"
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

	// Use ShareService to get share link
	shareLink, err := pc.shareService.GetShareLinkByToken(c.Request.Context(), token)
	if err != nil {
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
		password := c.Query("password")
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
// @Param password query string false "Share link password (if required)"
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

	// Get password from form or query
	password := c.PostForm("password")
	if password == "" {
		password = c.Query("password")
	}

	// Use ShareService to validate share link
	shareLink, file, err := pc.shareService.ValidateShareLink(c.Request.Context(), token, password)
	if err != nil {
		switch err.Error() {
		case "share link not found":
			utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		case "share link is not accessible":
			utils.ErrorResponse(c, http.StatusForbidden, "Share link is not accessible")
		case "password required":
			utils.ErrorResponse(c, http.StatusUnauthorized, "Password required for this share link")
		case "invalid password":
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid password")
		default:
			utils.InternalServerErrorResponse(c, "Failed to validate share link")
		}
		return
	}

	// Increment download counts using ShareService
	if err := pc.shareService.IncrementDownloadCount(shareLink.ID, file.ID); err != nil {
		// Log error but don't fail the download
		fmt.Printf("Failed to increment download count: %v\n", err)
	}

	// Get user from context if available
	userID, _ := middleware.GetUserIDFromContext(c)

	// Log download event
	if userID != uuid.Nil {
		pc.auditService.LogEvent(&userID, models.ActionFileDownload, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Shared file downloaded: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	} else {
		pc.auditService.LogEvent(nil, models.ActionFileDownload, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Shared file downloaded: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	}

	// Serve or redirect depending on storage driver
	if config.AppConfig.Storage.IsS3() {
		// For S3, redirect to the object URL stored in FilePath
		c.Redirect(http.StatusTemporaryRedirect, file.FilePath)
		return
	}

	// Local storage – serve file from disk
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", file.OriginalName))
	c.Header("Content-Type", file.MimeType)
	c.Header("Content-Length", fmt.Sprintf("%d", file.FileSize))
	c.File(file.FilePath)
}

// GeneratePresignedURL godoc
// @Summary Generate a pre-signed URL for public file download
// @Description Generate a pre-signed URL with expiration time for secure file download
// @Tags public
// @Accept json
// @Produce json
// @Param token path string true "Share token"
// @Param password query string false "Share link password (if required)"
// @Param expiration query int false "Expiration time in minutes (default: 10, max: 1440)"
// @Success 200 {object} utils.APIResponse "Pre-signed URL generated successfully"
// @Failure 400 {object} utils.APIResponse "Invalid token or expiration"
// @Failure 401 {object} utils.APIResponse "Password required or invalid"
// @Failure 403 {object} utils.APIResponse "Share link not accessible"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /public/share/{token}/presigned-url [post]
func (pc *PublicController) GeneratePresignedURL(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Share token is required")
		return
	}

	// Get password from form or query
	password := c.PostForm("password")
	if password == "" {
		password = c.Query("password")
	}

	// Parse expiration time (default 10 minutes, max 24 hours)
	expirationMinutes, _ := strconv.Atoi(c.DefaultQuery("expiration", "10"))
	if expirationMinutes < 1 || expirationMinutes > 1440 {
		utils.ErrorResponse(c, http.StatusBadRequest, "Expiration must be between 1 and 1440 minutes")
		return
	}

	expiration := time.Duration(expirationMinutes) * time.Minute

	// Use ShareService to validate share link and generate pre-signed URL
	shareLink, file, err := pc.shareService.ValidateShareLink(c.Request.Context(), token, password)
	if err != nil {
		switch err.Error() {
		case "share link not found":
			utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		case "share link is not accessible":
			utils.ErrorResponse(c, http.StatusForbidden, "Share link is not accessible")
		case "password required":
			utils.ErrorResponse(c, http.StatusUnauthorized, "Password required for this share link")
		case "invalid password":
			utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid password")
		default:
			utils.InternalServerErrorResponse(c, "Failed to validate share link")
		}
		return
	}

	// Generate pre-signed URL using ShareService
	url, err := pc.shareService.GeneratePresignedDownloadURL(c.Request.Context(), token, expiration)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate pre-signed URL")
		return
	}

	// Get user from context if available
	userID, _ := middleware.GetUserIDFromContext(c)

	// Log pre-signed URL generation event
	if userID != uuid.Nil {
		pc.auditService.LogEvent(&userID, models.ActionShareAccess, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Pre-signed URL generated for file: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	} else {
		pc.auditService.LogEvent(nil, models.ActionShareAccess, models.ResourceShareLink, &shareLink.ID,
			fmt.Sprintf("Pre-signed URL generated for file: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	}

	utils.SuccessResponse(c, http.StatusOK, "Pre-signed URL generated successfully", gin.H{
		"url":        url,
		"expires_in": expirationMinutes,
		"expires_at": time.Now().Add(expiration),
		"file_name":  file.OriginalName,
		"file_size":  file.FileSize,
		"mime_type":  file.MimeType,
	})
}

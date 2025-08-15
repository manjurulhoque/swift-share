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

type ShareController struct {
	shareService *services.ShareService
	auditService *services.AuditService
}

func NewShareController() *ShareController {
	return &ShareController{
		shareService: services.NewShareService(),
		auditService: services.NewAuditService(),
	}
}

// CreateShareLink godoc
// @Summary Create a new share link
// @Description Create a public share link for a file or folder
// @Tags sharing
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.ShareLinkCreateRequest true "Share link details"
// @Success 201 {object} utils.APIResponse "Share link created successfully"
// @Failure 400 {object} utils.APIResponse "Invalid request"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /share [post]
func (sc *ShareController) CreateShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	var req models.ShareLinkCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request format")
		return
	}

	shareLink, err := sc.shareService.CreateShareLink(user.ID, req)
	if err != nil {
		config.GetLogger().Error("Failed to create share link", "error", err, "user_id", user.ID)
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// Generate base URL for share link
	baseURL := c.Request.Host
	if c.Request.TLS == nil {
		baseURL = "http://" + baseURL
	} else {
		baseURL = "https://" + baseURL
	}

	sc.auditService.LogEvent(&user.ID, "share_create", "share_link", &shareLink.ID,
		"Share link created", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusCreated, "Share link created successfully",
		shareLink.ToResponse(baseURL))
}

// GetShareLinks godoc
// @Summary Get user's share links
// @Description Get all share links created by the current user
// @Tags sharing
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 20, max: 100)"
// @Success 200 {object} utils.APIResponse "Share links retrieved successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /share [get]
func (sc *ShareController) GetShareLinks(c *gin.Context) {
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

	shareLinks, total, err := sc.shareService.GetShareLinks(user.ID, page, limit)
	if err != nil {
		config.GetLogger().Error("Failed to get share links", "error", err, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to retrieve share links")
		return
	}

	// Generate base URL for share links
	baseURL := c.Request.Host
	if c.Request.TLS == nil {
		baseURL = "http://" + baseURL
	} else {
		baseURL = "https://" + baseURL
	}

	var responses []models.ShareLinkResponse
	for _, link := range shareLinks {
		responses = append(responses, link.ToResponse(baseURL))
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	utils.SuccessResponse(c, http.StatusOK, "Share links retrieved successfully", gin.H{
		"share_links":  responses,
		"total":        total,
		"current_page": page,
		"total_pages":  totalPages,
		"page_size":    limit,
	})
}

// GetShareLink godoc
// @Summary Get share link details
// @Description Get details of a specific share link
// @Tags sharing
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Share Link ID"
// @Success 200 {object} utils.APIResponse "Share link retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Invalid share link ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /share/{id} [get]
func (sc *ShareController) GetShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	linkID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid share link ID")
		return
	}

	shareLink, err := sc.shareService.GetShareLinkByToken(linkID.String())
	if err != nil || shareLink.UserID != user.ID {
		utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		return
	}

	baseURL := c.Request.Host
	if c.Request.TLS == nil {
		baseURL = "http://" + baseURL
	} else {
		baseURL = "https://" + baseURL
	}

	utils.SuccessResponse(c, http.StatusOK, "Share link retrieved successfully",
		shareLink.ToResponse(baseURL))
}

// UpdateShareLink godoc
// @Summary Update share link
// @Description Update settings of an existing share link
// @Tags sharing
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Share Link ID"
// @Param request body models.ShareLinkUpdateRequest true "Updated share link settings"
// @Success 200 {object} utils.APIResponse "Share link updated successfully"
// @Failure 400 {object} utils.APIResponse "Invalid request"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /share/{id} [put]
func (sc *ShareController) UpdateShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	linkID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid share link ID")
		return
	}

	var req models.ShareLinkUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request format")
		return
	}

	shareLink, err := sc.shareService.UpdateShareLink(user.ID, linkID, req)
	if err != nil {
		config.GetLogger().Error("Failed to update share link", "error", err, "link_id", linkID)
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	baseURL := c.Request.Host
	if c.Request.TLS == nil {
		baseURL = "http://" + baseURL
	} else {
		baseURL = "https://" + baseURL
	}

	sc.auditService.LogEvent(&user.ID, "share_update", "share_link", &shareLink.ID,
		"Share link updated", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Share link updated successfully",
		shareLink.ToResponse(baseURL))
}

// DeleteShareLink godoc
// @Summary Delete share link
// @Description Delete an existing share link
// @Tags sharing
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Share Link ID"
// @Success 200 {object} utils.APIResponse "Share link deleted successfully"
// @Failure 400 {object} utils.APIResponse "Invalid share link ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /share/{id} [delete]
func (sc *ShareController) DeleteShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	linkID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid share link ID")
		return
	}

	if err := sc.shareService.DeleteShareLink(user.ID, linkID); err != nil {
		config.GetLogger().Error("Failed to delete share link", "error", err, "link_id", linkID)
		utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		return
	}

	sc.auditService.LogEvent(&user.ID, "share_delete", "share_link", &linkID,
		"Share link deleted", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Share link deleted successfully", nil)
}

// AccessPublicShare godoc
// @Summary Access public share
// @Description Access a public share link (no authentication required)
// @Tags public
// @Accept json
// @Produce json
// @Param token path string true "Share Token"
// @Param request body models.ShareLinkAccessRequest false "Password if required"
// @Success 200 {object} utils.APIResponse "Share accessed successfully"
// @Failure 400 {object} utils.APIResponse "Invalid token or password"
// @Failure 404 {object} utils.APIResponse "Share not found"
// @Failure 410 {object} utils.APIResponse "Share expired"
// @Router /public/share/{token} [post]
func (sc *ShareController) AccessPublicShare(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Share token is required")
		return
	}

	var req models.ShareLinkAccessRequest
	c.ShouldBindJSON(&req) // Password is optional

	shareLink, err := sc.shareService.AccessShareLink(token, req.Password)
	if err != nil {
		if err.Error() == "share link has expired" {
			utils.ErrorResponse(c, http.StatusGone, "Share link has expired")
			return
		}
		if err.Error() == "password required" || err.Error() == "invalid password" {
			utils.ErrorResponse(c, http.StatusUnauthorized, err.Error())
			return
		}
		utils.ErrorResponse(c, http.StatusNotFound, "Share not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Share accessed successfully", shareLink.ToPublicInfo())
}

// GetPublicShareInfo godoc
// @Summary Get public share info
// @Description Get basic information about a public share (no password required)
// @Tags public
// @Accept json
// @Produce json
// @Param token path string true "Share Token"
// @Success 200 {object} utils.APIResponse "Share info retrieved successfully"
// @Failure 404 {object} utils.APIResponse "Share not found"
// @Failure 410 {object} utils.APIResponse "Share expired"
// @Router /public/share/{token} [get]
func (sc *ShareController) GetPublicShareInfo(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Share token is required")
		return
	}

	shareLink, err := sc.shareService.GetShareLinkByToken(token)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Share not found")
		return
	}

	if shareLink.IsExpired() {
		utils.ErrorResponse(c, http.StatusGone, "Share link has expired")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Share info retrieved successfully", shareLink.ToPublicInfo())
}

// GetShareStats godoc
// @Summary Get sharing statistics
// @Description Get sharing statistics for the current user
// @Tags sharing
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.APIResponse "Share statistics retrieved successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /share/stats [get]
func (sc *ShareController) GetShareStats(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	stats, err := sc.shareService.GetShareStats(user.ID)
	if err != nil {
		config.GetLogger().Error("Failed to get share stats", "error", err, "user_id", user.ID)
		utils.InternalServerErrorResponse(c, "Failed to retrieve share statistics")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Share statistics retrieved successfully", stats)
}

package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

type ShareController struct {
	auditService *services.AuditService
}

func NewShareController() *ShareController {
	return &ShareController{
		auditService: services.NewAuditService(),
	}
}

// CreateShareLink godoc
// @Summary Create a share link
// @Description Create a new share link for a file
// @Tags shares
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param share body models.ShareLinkCreateRequest true "Share link creation information"
// @Success 201 {object} utils.APIResponse "Share link created successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "File not found"
// @Router /shares [post]
func (sc *ShareController) CreateShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	var req models.ShareLinkCreateRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	// Check if file exists and belongs to user
	var file models.File
	if err := database.GetDB().Where("id = ? AND user_id = ?", req.FileID, user.ID).First(&file).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "File not found")
		return
	}

	// Create share link
	shareLink := models.ShareLink{
		UserID:       user.ID,
		FileID:       req.FileID,
		Password:     req.Password,
		ExpiresAt:    req.ExpiresAt,
		MaxDownloads: req.MaxDownloads,
		Description:  req.Description,
	}

	if err := database.GetDB().Create(&shareLink).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to create share link")
		return
	}

	// Load file data for response
	database.GetDB().Preload("File").First(&shareLink, shareLink.ID)

	sc.auditService.LogEvent(&user.ID, models.ActionShareCreate, models.ResourceShareLink, &shareLink.ID,
		fmt.Sprintf("Share link created for file: %s", file.OriginalName), c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusCreated, "Share link created successfully", shareLink.ToResponse())
}

// GetShareLinks godoc
// @Summary Get user share links
// @Description Get a paginated list of user's share links
// @Tags shares
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 10, max: 100)"
// @Param search query string false "Search term for file name or description"
// @Success 200 {object} utils.APIResponse "Share links retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /shares [get]
func (sc *ShareController) GetShareLinks(c *gin.Context) {
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

	query := database.GetDB().Where("user_id = ?", user.ID).Preload("File")

	if search != "" {
		query = query.Joins("JOIN files ON share_links.file_id = files.id").
			Where("files.original_name LIKE ? OR share_links.description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	var total int64
	query.Model(&models.ShareLink{}).Count(&total)

	var shareLinks []models.ShareLink
	offset := (page - 1) * limit
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&shareLinks).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve share links")
		return
	}

	var responses []models.ShareLinkResponse
	for _, shareLink := range shareLinks {
		responses = append(responses, shareLink.ToResponse())
	}

	response := gin.H{
		"share_links": responses,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": (int(total) + limit - 1) / limit,
		},
	}

	utils.SuccessResponse(c, http.StatusOK, "Share links retrieved successfully", response)
}

// GetShareLink godoc
// @Summary Get a specific share link
// @Description Get detailed information about a specific share link
// @Tags shares
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Share link ID"
// @Success 200 {object} utils.APIResponse "Share link retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Invalid share link ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /shares/{id} [get]
func (sc *ShareController) GetShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	shareID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid share link ID")
		return
	}

	var shareLink models.ShareLink
	if err := database.GetDB().Where("id = ? AND user_id = ?", shareID, user.ID).Preload("File").First(&shareLink).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Share link retrieved successfully", shareLink.ToResponse())
}

// UpdateShareLink godoc
// @Summary Update share link
// @Description Update share link information including password, expiration, and limits
// @Tags shares
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Share link ID"
// @Param share body models.ShareLinkUpdateRequest true "Share link update information"
// @Success 200 {object} utils.APIResponse "Share link updated successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /shares/{id} [put]
func (sc *ShareController) UpdateShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	shareID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid share link ID")
		return
	}

	var req models.ShareLinkUpdateRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	var shareLink models.ShareLink
	if err := database.GetDB().Where("id = ? AND user_id = ?", shareID, user.ID).First(&shareLink).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		return
	}

	// Update fields
	if req.Password != "" {
		shareLink.Password = req.Password
	}
	shareLink.ExpiresAt = req.ExpiresAt
	shareLink.MaxDownloads = req.MaxDownloads
	shareLink.Description = req.Description
	shareLink.IsActive = req.IsActive

	if err := database.GetDB().Save(&shareLink).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update share link")
		return
	}

	sc.auditService.LogEvent(&user.ID, models.ActionShareUpdate, models.ResourceShareLink, &shareLink.ID,
		"Share link updated", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Share link updated successfully", shareLink.ToResponse())
}

// DeleteShareLink godoc
// @Summary Delete a share link
// @Description Delete a share link permanently
// @Tags shares
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "Share link ID"
// @Success 200 {object} utils.APIResponse "Share link deleted successfully"
// @Failure 400 {object} utils.APIResponse "Invalid share link ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Share link not found"
// @Router /shares/{id} [delete]
func (sc *ShareController) DeleteShareLink(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	shareID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid share link ID")
		return
	}

	var shareLink models.ShareLink
	if err := database.GetDB().Where("id = ? AND user_id = ?", shareID, user.ID).First(&shareLink).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Share link not found")
		return
	}

	if err := database.GetDB().Delete(&shareLink).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to delete share link")
		return
	}

	sc.auditService.LogEvent(&user.ID, models.ActionShareDelete, models.ResourceShareLink, &shareLink.ID,
		"Share link deleted", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Share link deleted successfully", nil)
}

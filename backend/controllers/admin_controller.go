package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

type AdminController struct {
	auditService *services.AuditService
}

func NewAdminController() *AdminController {
	return &AdminController{
		auditService: services.NewAuditService(),
	}
}

// GetUsers godoc
// @Summary Get all users
// @Description Get a paginated list of all users with filtering options
// @Tags admin
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 10, max: 100)"
// @Param search query string false "Search term for user name or email"
// @Param status query string false "Filter by status (active, inactive, all)"
// @Success 200 {object} utils.APIResponse "Users retrieved successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 403 {object} utils.APIResponse "Admin access required"
// @Router /admin/users [get]
func (ac *AdminController) GetUsers(c *gin.Context) {
	admin, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	status := c.Query("status") // active, inactive, all

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	query := database.GetDB().Model(&models.User{})

	if search != "" {
		query = query.Where("first_name LIKE ? OR last_name LIKE ? OR email LIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if status == "active" {
		query = query.Where("is_active = ?", true)
	} else if status == "inactive" {
		query = query.Where("is_active = ?", false)
	}

	var total int64
	query.Count(&total)

	var users []models.User
	offset := (page - 1) * limit
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&users).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to retrieve users")
		return
	}

	var responses []models.UserResponse
	for _, user := range users {
		responses = append(responses, user.ToResponse())
	}

	response := gin.H{
		"users": responses,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": (int(total) + limit - 1) / limit,
		},
	}

	ac.auditService.LogEvent(&admin.ID, models.ActionUserUpdate, models.ResourceUser, nil,
		"Admin viewed user list", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Users retrieved successfully", response)
}

// GetSystemStats godoc
// @Summary Get system statistics
// @Description Get comprehensive system statistics including users, files, shares, and downloads
// @Tags admin
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.APIResponse "System statistics retrieved successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 403 {object} utils.APIResponse "Admin access required"
// @Router /admin/stats [get]
func (ac *AdminController) GetSystemStats(c *gin.Context) {
	admin, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	var stats struct {
		TotalUsers     int64 `json:"total_users"`
		ActiveUsers    int64 `json:"active_users"`
		TotalFiles     int64 `json:"total_files"`
		TotalFileSize  int64 `json:"total_file_size"`
		TotalShares    int64 `json:"total_shares"`
		TotalDownloads int64 `json:"total_downloads"`
		PublicFiles    int64 `json:"public_files"`
		PrivateFiles   int64 `json:"private_files"`
		ActiveShares   int64 `json:"active_shares"`
		ExpiredShares  int64 `json:"expired_shares"`
	}

	// User statistics
	database.GetDB().Model(&models.User{}).Count(&stats.TotalUsers)
	database.GetDB().Model(&models.User{}).Where("is_active = ?", true).Count(&stats.ActiveUsers)

	// File statistics
	database.GetDB().Model(&models.File{}).Count(&stats.TotalFiles)
	database.GetDB().Model(&models.File{}).Select("COALESCE(SUM(file_size), 0)").Scan(&stats.TotalFileSize)
	database.GetDB().Model(&models.File{}).Where("is_public = ?", true).Count(&stats.PublicFiles)
	database.GetDB().Model(&models.File{}).Where("is_public = ?", false).Count(&stats.PrivateFiles)

	// Collaboration statistics
	database.GetDB().Model(&models.Collaborator{}).Count(&stats.TotalShares)
	database.GetDB().Model(&models.Collaborator{}).Where("expires_at IS NULL OR expires_at > NOW()").Count(&stats.ActiveShares)
	database.GetDB().Model(&models.Collaborator{}).Where("expires_at IS NOT NULL AND expires_at <= NOW()").Count(&stats.ExpiredShares)

	// Download statistics
	database.GetDB().Model(&models.File{}).Select("COALESCE(SUM(download_count), 0)").Scan(&stats.TotalDownloads)

	ac.auditService.LogEvent(&admin.ID, models.ActionUserUpdate, models.ResourceSystem, nil,
		"Admin viewed system statistics", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "System statistics retrieved successfully", stats)
}

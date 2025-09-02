package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/services"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

type AuthController struct {
	userService  *services.UserService
	auditService *services.AuditService
}

func NewAuthController() *AuthController {
	return &AuthController{
		userService:  services.NewUserService(),
		auditService: services.NewAuditService(),
	}
}

// Register godoc
// @Summary Register a new user
// @Description Create a new user account
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.UserRegisterRequest true "User registration information"
// @Success 201 {object} utils.APIResponse "User registered successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 409 {object} utils.APIResponse "Email already registered"
// @Failure 500 {object} utils.APIResponse "Internal server error"
// @Router /auth/register [post]
func (ac *AuthController) Register(c *gin.Context) {
	var req models.UserRegisterRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	// Check if user already exists
	if ac.userService.EmailExists(req.Email) {
		utils.ErrorResponse(c, http.StatusConflict, "Email already registered")
		return
	}

	// Create user
	user := models.User{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  req.Password,
	}

	if err := database.GetDB().Create(&user).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to create user")
		return
	}

	// Log audit event
	ac.auditService.LogEvent(nil, models.ActionRegister, models.ResourceUser, &user.ID,
		"User registered successfully", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	// Generate JWT tokens
	accessToken, err := middleware.GenerateToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate access token")
		return
	}

	refreshToken, err := middleware.GenerateRefreshToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate refresh token")
		return
	}

	response := gin.H{
		"user": user.ToResponse(),
		"tokens": gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
		},
	}

	utils.SuccessResponse(c, http.StatusCreated, "User registered successfully", response)
}

// Login godoc
// @Summary Login a user
// @Description Authenticate a user and return a JWT token
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.UserLoginRequest true "User login credentials"
// @Success 200 {object} utils.APIResponse "Login successful"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Invalid email or password"
// @Failure 500 {object} utils.APIResponse "Internal server error"
// @Router /auth/login [post]
func (ac *AuthController) Login(c *gin.Context) {
	var req models.UserLoginRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	// Find user by email
	var user models.User
	if err := database.GetDB().Where("email = ?", req.Email).First(&user).Error; err != nil {
		// Log failed login attempt
		ac.auditService.LogEvent(nil, models.ActionLogin, models.ResourceAuth, nil,
			"Login failed - user not found: "+req.Email, c.ClientIP(), c.GetHeader("User-Agent"), models.StatusFailure)

		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Check if user is active
	if !user.IsActive {
		ac.auditService.LogEvent(&user.ID, models.ActionLogin, models.ResourceAuth, &user.ID,
			"Login failed - user inactive", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusFailure)

		utils.ErrorResponse(c, http.StatusUnauthorized, "Account is deactivated")
		return
	}

	// Verify password
	if !user.CheckPassword(req.Password) {
		ac.auditService.LogEvent(&user.ID, models.ActionLogin, models.ResourceAuth, &user.ID,
			"Login failed - invalid password", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusFailure)

		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Update last login time
	now := time.Now()
	user.LastLoginAt = &now
	database.GetDB().Save(&user)

	// Log successful login
	ac.auditService.LogEvent(&user.ID, models.ActionLogin, models.ResourceAuth, &user.ID,
		"User logged in successfully", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	// Generate JWT tokens
	accessToken, err := middleware.GenerateToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate access token")
		return
	}

	refreshToken, err := middleware.GenerateRefreshToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate refresh token")
		return
	}

	response := gin.H{
		"user": user.ToResponse(),
		"tokens": gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
		},
	}

	utils.SuccessResponse(c, http.StatusOK, "Login successful", response)
}

// GetProfile godoc
// @Summary Get user profile
// @Description Get the current user's profile information
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.APIResponse "Profile retrieved successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /auth/profile [get]
func (ac *AuthController) GetProfile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Profile retrieved successfully", user.ToResponse())
}

// UpdateProfile godoc
// @Summary Update user profile
// @Description Update the current user's profile information
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param user body models.UserUpdateRequest true "User profile update information"
// @Success 200 {object} utils.APIResponse "Profile updated successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 409 {object} utils.APIResponse "Email already registered"
// @Failure 500 {object} utils.APIResponse "Internal server error"
// @Router /auth/profile [put]
func (ac *AuthController) UpdateProfile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	var req models.UserUpdateRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	// Check if email is being changed and already exists
	if req.Email != "" && req.Email != user.Email {
		if ac.userService.EmailExists(req.Email) {
			utils.ErrorResponse(c, http.StatusConflict, "Email already registered")
			return
		}
		user.Email = req.Email
	}

	// Update fields if provided
	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}

	// Save changes
	if err := database.GetDB().Save(user).Error; err != nil {
		utils.InternalServerErrorResponse(c, "Failed to update profile")
		return
	}

	// Log audit event
	ac.auditService.LogEvent(&user.ID, models.ActionUserUpdate, models.ResourceUser, &user.ID,
		"User profile updated", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Profile updated successfully", user.ToResponse())
}

// Logout godoc
// @Summary Logout user
// @Description Log out the current user (mainly for audit purposes)
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.APIResponse "Logout successful"
// @Router /auth/logout [post]
func (ac *AuthController) Logout(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if exists {
		// Log logout event
		ac.auditService.LogEvent(&userID, models.ActionLogout, models.ResourceAuth, &userID,
			"User logged out", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	}

	utils.SuccessResponse(c, http.StatusOK, "Logout successful", nil)
}

// RefreshToken godoc
// @Summary Refresh access token
// @Description Generate a new access token using a valid refresh token
// @Tags auth
// @Accept json
// @Produce json
// @Param refresh_token body models.RefreshTokenRequest true "Refresh token"
// @Success 200 {object} utils.APIResponse "Token refreshed successfully"
// @Failure 400 {object} utils.APIResponse "Validation error"
// @Failure 401 {object} utils.APIResponse "Invalid or expired refresh token"
// @Failure 500 {object} utils.APIResponse "Internal server error"
// @Router /auth/refresh [post]
func (ac *AuthController) RefreshToken(c *gin.Context) {
	var req models.RefreshTokenRequest
	if !utils.BindAndValidate(c, &req) {
		return
	}

	// Parse and validate the refresh token
	claims := &middleware.Claims{}
	token, err := jwt.ParseWithClaims(req.RefreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.AppConfig.JWT.Secret), nil
	})

	if err != nil || !token.Valid {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid refresh token")
		return
	}

	// Check if token is expired
	if claims.ExpiresAt.Time.Before(time.Now()) {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Refresh token has expired")
		return
	}

	// Get user from database
	var user models.User
	if err := database.GetDB().Where("id = ? AND is_active = ?", claims.UserID, true).First(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not found or inactive")
		return
	}

	// Generate new access token
	accessToken, err := middleware.GenerateToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate access token")
		return
	}

	// Generate new refresh token
	refreshToken, err := middleware.GenerateRefreshToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate refresh token")
		return
	}

	response := gin.H{
		"tokens": gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
		},
	}

	// Log the token refresh event
	ac.auditService.LogEvent(&user.ID, models.ActionTokenRefresh, models.ResourceAuth, &user.ID,
		"Access token refreshed", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)

	utils.SuccessResponse(c, http.StatusOK, "Token refreshed successfully", response)
}

// GetDashboardStats godoc
// @Summary Get user dashboard statistics
// @Description Get statistics for the user's dashboard including file counts, storage usage, and sharing stats
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.APIResponse "Dashboard statistics retrieved successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Router /auth/dashboard-stats [get]
func (ac *AuthController) GetDashboardStats(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	var stats struct {
		TotalFiles     int64 `json:"total_files"`
		StorageUsed    int64 `json:"storage_used"`
		SharedFiles    int64 `json:"shared_files"`
		TotalDownloads int64 `json:"total_downloads"`
	}

	// Count total files (excluding trashed)
	database.GetDB().Model(&models.File{}).
		Where("user_id = ? AND is_trashed = false", user.ID).
		Count(&stats.TotalFiles)

	// Calculate total storage used (excluding trashed)
	database.GetDB().Model(&models.File{}).
		Where("user_id = ? AND is_trashed = false", user.ID).
		Select("COALESCE(SUM(file_size), 0)").
		Scan(&stats.StorageUsed)

	// Count shared files (files with collaborators or public files)
	var sharedCount int64
	database.GetDB().Model(&models.File{}).
		Joins("LEFT JOIN collaborators ON files.id = collaborators.file_id").
		Where("files.user_id = ? AND files.is_trashed = false AND (files.is_public = true OR collaborators.id IS NOT NULL)", user.ID).
		Distinct("files.id").
		Count(&sharedCount)
	stats.SharedFiles = sharedCount

	// Calculate total downloads
	database.GetDB().Model(&models.File{}).
		Where("user_id = ? AND is_trashed = false", user.ID).
		Select("COALESCE(SUM(download_count), 0)").
		Scan(&stats.TotalDownloads)

	utils.SuccessResponse(c, http.StatusOK, "Dashboard statistics retrieved successfully", stats)
}

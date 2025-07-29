package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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

// Register creates a new user account
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

	// Generate JWT token
	token, err := middleware.GenerateToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate token")
		return
	}

	response := gin.H{
		"user":  user.ToResponse(),
		"token": token,
	}

	utils.SuccessResponse(c, http.StatusCreated, "User registered successfully", response)
}

// Login authenticates a user and returns a JWT token
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

	// Generate JWT token
	token, err := middleware.GenerateToken(user)
	if err != nil {
		utils.InternalServerErrorResponse(c, "Failed to generate token")
		return
	}

	response := gin.H{
		"user":  user.ToResponse(),
		"token": token,
	}

	utils.SuccessResponse(c, http.StatusOK, "Login successful", response)
}

// GetProfile returns the current user's profile
func (ac *AuthController) GetProfile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		utils.UnauthorizedResponse(c, "User not found in context")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Profile retrieved successfully", user.ToResponse())
}

// UpdateProfile updates the current user's profile
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

// Logout logs out the current user (mainly for audit purposes)
func (ac *AuthController) Logout(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if exists {
		// Log logout event
		ac.auditService.LogEvent(&userID, models.ActionLogout, models.ResourceAuth, &userID,
			"User logged out", c.ClientIP(), c.GetHeader("User-Agent"), models.StatusSuccess)
	}

	utils.SuccessResponse(c, http.StatusOK, "Logout successful", nil)
}

package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/swift-share/backend/controllers"
	"github.com/manjurulhoque/swift-share/backend/middleware"
)

func SetupRoutes(router *gin.Engine) {
	// Initialize controllers
	authController := controllers.NewAuthController()
	fileController := controllers.NewFileController()
	adminController := controllers.NewAdminController()

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Public routes (no authentication required)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
			auth.POST("/refresh", authController.RefreshToken)
		}

		// Protected routes (authentication required)
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// Auth related protected routes
			authProtected := protected.Group("/auth")
			{
				authProtected.GET("/profile", authController.GetProfile)
				authProtected.PUT("/profile", authController.UpdateProfile)
				authProtected.POST("/logout", authController.Logout)
			}

			// File management routes
			files := protected.Group("/files")
			{
				files.GET("/", fileController.GetFiles)
				files.POST("/upload", fileController.UploadFile)
				files.POST("/upload-multiple", fileController.UploadMultipleFiles)
				files.GET("/:id", fileController.GetFile)
				// Owner-only operations
				files.PUT("/:id", middleware.FileOwnerMiddleware(), fileController.UpdateFile)
				files.DELETE("/:id", middleware.FileOwnerMiddleware(), fileController.DeleteFile)
				// Download/presign allow collaborators; keep standard auth only
				files.GET("/:id/download", fileController.DownloadFile)
				files.POST("/:id/presigned-url", fileController.GeneratePresignedURL)
				// Collaborators
				files.GET("/:id/collaborators", middleware.FileOwnerMiddleware(), fileController.GetCollaborators)
				files.POST("/:id/collaborators", middleware.FileOwnerMiddleware(), fileController.AddCollaborator)
				files.PUT("/:id/collaborators/:collaboratorId", middleware.FileOwnerMiddleware(), fileController.UpdateCollaborator)
				files.DELETE("/:id/collaborators/:collaboratorId", middleware.FileOwnerMiddleware(), fileController.RemoveCollaborator)
			}

		}

		// Admin routes (admin authentication required)
		admin := v1.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		admin.Use(middleware.AdminMiddleware())
		{
			admin.GET("/users", adminController.GetUsers)
			admin.GET("/stats", adminController.GetSystemStats)
		}

	}

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Swift Share API is running",
		})
	})

	// API documentation endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"name":        "Swift Share API",
			"version":     "1.0.0",
			"description": "Professional file sharing platform API",
			"endpoints": gin.H{
				"auth": gin.H{
					"POST /api/v1/auth/register": "User registration",
					"POST /api/v1/auth/login":    "User login",
					"POST /api/v1/auth/refresh":  "Refresh access token",
					"GET  /api/v1/auth/profile":  "Get user profile (protected)",
					"PUT  /api/v1/auth/profile":  "Update user profile (protected)",
					"POST /api/v1/auth/logout":   "User logout (protected)",
				},
				"files": gin.H{
					"GET  /api/v1/files":        "List user files (protected)",
					"POST /api/v1/files/upload": "Upload file (protected)",
				},

				"admin": gin.H{
					"GET /api/v1/admin/users":      "List all users (admin)",
					"GET /api/v1/admin/stats":      "System statistics (admin)",
					"GET /api/v1/admin/audit-logs": "Audit logs (admin)",
				},
			},
		})
	})
}

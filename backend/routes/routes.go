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
	shareController := controllers.NewShareController()
	adminController := controllers.NewAdminController()
	publicController := controllers.NewPublicController()

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
				files.PUT("/:id", fileController.UpdateFile)
				files.DELETE("/:id", fileController.DeleteFile)
				files.GET("/:id/download", fileController.DownloadFile)
			}

			// Share links routes
			shares := protected.Group("/shares")
			{
				shares.GET("/", shareController.GetShareLinks)
				shares.POST("/", shareController.CreateShareLink)
				shares.GET("/:id", shareController.GetShareLink)
				shares.PUT("/:id", shareController.UpdateShareLink)
				shares.DELETE("/:id", shareController.DeleteShareLink)
				shares.POST("/:id/presigned-url", shareController.GeneratePresignedURL)
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

		// Public file access routes (no authentication, but may have optional auth)
		public := v1.Group("/public")
		public.Use(middleware.OptionalAuthMiddleware())
		{
			public.GET("/share/:token", publicController.AccessShareLink)
			public.POST("/share/:token/download", publicController.DownloadSharedFile)
			public.POST("/share/:token/presigned-url", publicController.GeneratePresignedURL)
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
				"shares": gin.H{
					"GET  /api/v1/shares":                            "List user shares (protected)",
					"POST /api/v1/shares":                            "Create share link (protected)",
					"POST /api/v1/shares/:id/presigned-url":          "Generate pre-signed URL (protected)",
					"GET  /api/v1/public/share/:token":               "Access shared file (public)",
					"POST /api/v1/public/share/:token/download":      "Download shared file (public)",
					"POST /api/v1/public/share/:token/presigned-url": "Generate pre-signed URL (public)",
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

package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/swift-share/backend/controllers"
	"github.com/manjurulhoque/swift-share/backend/middleware"
)

func SetupRoutes(router *gin.Engine) {
	// Initialize controllers
	authController := controllers.NewAuthController()

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
				// TODO: Implement file controller
				files.GET("/", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Files endpoint - TODO"}) })
				files.POST("/upload", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Upload endpoint - TODO"}) })
			}

			// Share links routes
			shares := protected.Group("/shares")
			{
				// TODO: Implement share controller
				shares.GET("/", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Shares endpoint - TODO"}) })
				shares.POST("/", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Create share endpoint - TODO"}) })
			}
		}

		// Admin routes (admin authentication required)
		admin := v1.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		admin.Use(middleware.AdminMiddleware())
		{
			// TODO: Implement admin controllers
			admin.GET("/users", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Admin users endpoint - TODO"}) })
			admin.GET("/stats", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Admin stats endpoint - TODO"}) })
			admin.GET("/audit-logs", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Admin audit logs endpoint - TODO"}) })
		}

		// Public file access routes (no authentication, but may have optional auth)
		public := v1.Group("/public")
		public.Use(middleware.OptionalAuthMiddleware())
		{
			// TODO: Implement public file access
			public.GET("/share/:token", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Public share access - TODO"}) })
			public.POST("/share/:token/download", func(c *gin.Context) { c.JSON(200, gin.H{"message": "Public download - TODO"}) })
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
					"GET  /api/v1/shares":              "List user shares (protected)",
					"POST /api/v1/shares":              "Create share link (protected)",
					"GET  /api/v1/public/share/:token": "Access shared file (public)",
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

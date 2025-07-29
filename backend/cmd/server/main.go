package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/routes"
)

func main() {
	// Load configuration (this also initializes the logger)
	config.LoadConfig()

	// Get the configured logger
	logger := config.GetLogger()

	// Set Gin mode
	gin.SetMode(config.AppConfig.Server.GinMode)

	// Connect to database
	database.Connect()

	// Run database migrations
	database.Migrate()

	// Create Gin router
	router := gin.New()

	// Add global middleware
	router.Use(middleware.SlogMiddleware()) // Use our slog middleware instead
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	// Setup routes
	routes.SetupRoutes(router)

	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(config.AppConfig.Upload.UploadPath, 0755); err != nil {
		logger.Error("Failed to create upload directory", "error", err, "path", config.AppConfig.Upload.UploadPath)
		os.Exit(1)
	}

	// Start server
	serverAddr := config.AppConfig.Server.Host + ":" + config.AppConfig.Server.Port

	logger.Info("Starting Swift Share server",
		"address", serverAddr,
		"mode", config.AppConfig.Server.GinMode,
		"database", config.AppConfig.Database.Driver,
		"upload_path", config.AppConfig.Upload.UploadPath,
		"max_file_size_mb", config.AppConfig.Upload.MaxFileSize/(1024*1024),
	)

	if err := router.Run(":" + config.AppConfig.Server.Port); err != nil {
		logger.Error("Failed to start server", "error", err, "port", config.AppConfig.Server.Port)
		os.Exit(1)
	}
}

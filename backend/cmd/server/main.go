package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/docs"
	"github.com/manjurulhoque/swift-share/backend/middleware"
	"github.com/manjurulhoque/swift-share/backend/routes"
	"github.com/manjurulhoque/swift-share/backend/storage"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Swift Share API
// @version         1.0
// @description     Professional file sharing platform API
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    https://github.com/manjurulhoque/swift-share
// @contact.email  support@swiftshare.com

// @license.name  MIT
// @license.url   https://opensource.org/licenses/MIT

// @host      localhost:8080
// @BasePath  /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
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

	// Initialize storage service
	if err := storage.InitDefaultStorage(); err != nil {
		logger.Error("Failed to initialize storage", "error", err)
		os.Exit(1)
	}

	// Create Gin router
	router := gin.New()

	// Add global middleware
	router.Use(middleware.SlogMiddleware()) // Use our slog middleware instead
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	// Setup routes
	routes.SetupRoutes(router)

	// Swagger documentation
	docs.SwaggerInfo.BasePath = "/api/v1"
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

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

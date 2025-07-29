package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/swift-share/backend/config"
)

// CORSMiddleware sets up CORS configuration
func CORSMiddleware() gin.HandlerFunc {
	corsConfig := cors.Config{
		AllowOrigins:     config.AppConfig.CORS.AllowedOrigins,
		AllowMethods:     config.AppConfig.CORS.AllowedMethods,
		AllowHeaders:     config.AppConfig.CORS.AllowedHeaders,
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
	}

	return cors.New(corsConfig)
}

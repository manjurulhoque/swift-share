package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/swift-share/backend/config"
)

// SlogMiddleware returns a Gin middleware that logs requests using slog
func SlogMiddleware() gin.HandlerFunc {
	logger := config.GetLogger()

	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		// Process request
		c.Next()

		// Calculate latency
		latency := time.Since(start)

		// Get client IP
		clientIP := c.ClientIP()

		// Get request method
		method := c.Request.Method

		// Get status code
		statusCode := c.Writer.Status()

		// Get user agent
		userAgent := c.Request.UserAgent()

		// Build full path with query params
		if raw != "" {
			path = path + "?" + raw
		}

		// Determine log level based on status code
		logAttrs := []any{
			"method", method,
			"path", path,
			"status", statusCode,
			"latency", latency.String(),
			"latency_ms", latency.Milliseconds(),
			"client_ip", clientIP,
			"user_agent", userAgent,
			"body_size", c.Writer.Size(),
		}

		// Add error if exists
		if len(c.Errors) > 0 {
			logAttrs = append(logAttrs, "errors", c.Errors.String())
		}

		// Log based on status code
		switch {
		case statusCode >= 500:
			logger.Error("Server error", logAttrs...)
		case statusCode >= 400:
			logger.Warn("Client error", logAttrs...)
		case statusCode >= 300:
			logger.Info("Redirect", logAttrs...)
		default:
			logger.Info("Request processed", logAttrs...)
		}
	}
}

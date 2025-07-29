package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
}

type PaginationMeta struct {
	CurrentPage int   `json:"current_page"`
	PerPage     int   `json:"per_page"`
	Total       int64 `json:"total"`
	TotalPages  int   `json:"total_pages"`
}

// SuccessResponse sends a success response
func SuccessResponse(c *gin.Context, code int, message string, data interface{}) {
	c.JSON(code, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, code int, message string) {
	c.JSON(code, APIResponse{
		Success: false,
		Message: message,
	})
}

// ErrorResponseWithData sends an error response with additional data
func ErrorResponseWithData(c *gin.Context, code int, message string, errorData interface{}) {
	c.JSON(code, APIResponse{
		Success: false,
		Message: message,
		Error:   errorData,
	})
}

// PaginatedResponse sends a paginated response
func PaginatedResponse(c *gin.Context, code int, message string, data interface{}, meta PaginationMeta) {
	c.JSON(code, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
		Meta:    meta,
	})
}

// ValidationErrorResponse sends a validation error response
func ValidationErrorResponse(c *gin.Context, errors map[string]string) {
	c.JSON(http.StatusBadRequest, APIResponse{
		Success: false,
		Message: "Validation failed",
		Error:   errors,
	})
}

// NotFoundResponse sends a not found response
func NotFoundResponse(c *gin.Context, resource string) {
	ErrorResponse(c, http.StatusNotFound, resource+" not found")
}

// UnauthorizedResponse sends an unauthorized response
func UnauthorizedResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Unauthorized access"
	}
	ErrorResponse(c, http.StatusUnauthorized, message)
}

// ForbiddenResponse sends a forbidden response
func ForbiddenResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Access forbidden"
	}
	ErrorResponse(c, http.StatusForbidden, message)
}

// InternalServerErrorResponse sends an internal server error response
func InternalServerErrorResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Internal server error"
	}
	ErrorResponse(c, http.StatusInternalServerError, message)
}

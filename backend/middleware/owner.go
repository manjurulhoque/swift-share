package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/utils"
)

// FileOwnerMiddleware ensures the authenticated user is the owner of the file in :id
func FileOwnerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := GetUserFromContext(c)
		if !exists {
			utils.UnauthorizedResponse(c, "User not found in context")
			c.Abort()
			return
		}

		idParam := c.Param("id")
		fileID, err := uuid.Parse(idParam)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid file ID")
			c.Abort()
			return
		}

		var file models.File
		if err := database.GetDB().Select("user_id").Where("id = ?", fileID).First(&file).Error; err != nil {
			utils.ErrorResponse(c, http.StatusNotFound, "File not found")
			c.Abort()
			return
		}

		if file.UserID != user.ID {
			utils.ErrorResponse(c, http.StatusForbidden, "Only the owner can perform this action")
			c.Abort()
			return
		}

		c.Next()
	}
}

// FolderOwnerMiddleware ensures the authenticated user is the owner of the folder in :id
func FolderOwnerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := GetUserFromContext(c)
		if !exists {
			utils.UnauthorizedResponse(c, "User not found in context")
			c.Abort()
			return
		}

		idParam := c.Param("id")
		folderID, err := uuid.Parse(idParam)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid folder ID")
			c.Abort()
			return
		}

		var folder models.Folder
		if err := database.GetDB().Select("user_id").Where("id = ?", folderID).First(&folder).Error; err != nil {
			utils.ErrorResponse(c, http.StatusNotFound, "Folder not found")
			c.Abort()
			return
		}

		if folder.UserID != user.ID {
			utils.ErrorResponse(c, http.StatusForbidden, "Only the owner can perform this action")
			c.Abort()
			return
		}

		c.Next()
	}
}

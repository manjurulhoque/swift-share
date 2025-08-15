package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type ShareService struct {
	db *gorm.DB
}

func NewShareService() *ShareService {
	return &ShareService{
		db: database.GetDB(),
	}
}

// CreateShareLink creates a new share link for a file or folder
func (ss *ShareService) CreateShareLink(userID uuid.UUID, req models.ShareLinkCreateRequest) (*models.ShareLink, error) {
	// Validate that either FileID or FolderID is provided, but not both
	if (req.FileID == nil && req.FolderID == nil) || (req.FileID != nil && req.FolderID != nil) {
		return nil, errors.New("either file_id or folder_id must be provided, but not both")
	}

	// Verify ownership
	if req.FileID != nil {
		var file models.File
		if err := ss.db.Where("id = ? AND user_id = ? AND is_trashed = false", *req.FileID, userID).First(&file).Error; err != nil {
			return nil, errors.New("file not found or access denied")
		}
	}

	if req.FolderID != nil {
		var folder models.Folder
		if err := ss.db.Where("id = ? AND user_id = ? AND is_trashed = false", *req.FolderID, userID).First(&folder).Error; err != nil {
			return nil, errors.New("folder not found or access denied")
		}
	}

	// Generate secure token
	token, err := generateSecureToken(32)
	if err != nil {
		return nil, err
	}

	// Create share link
	shareLink := &models.ShareLink{
		UserID:        userID,
		FileID:        req.FileID,
		FolderID:      req.FolderID,
		Token:         token,
		Permission:    req.Permission,
		ExpiresAt:     req.ExpiresAt,
		AllowDownload: req.AllowDownload,
		IsPublic:      true,
	}

	// Handle password protection
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		shareLink.Password = string(hashedPassword)
		shareLink.HasPassword = true
	}

	if err := ss.db.Create(shareLink).Error; err != nil {
		return nil, err
	}

	// Load relationships
	ss.loadShareLinkRelations(shareLink)

	return shareLink, nil
}

// GetShareLinks returns all share links for a user
func (ss *ShareService) GetShareLinks(userID uuid.UUID, page, limit int) ([]models.ShareLink, int64, error) {
	var shareLinks []models.ShareLink
	var total int64

	offset := (page - 1) * limit

	// Count total
	if err := ss.db.Model(&models.ShareLink{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with relationships
	if err := ss.db.Preload("User").Preload("File").Preload("Folder").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&shareLinks).Error; err != nil {
		return nil, 0, err
	}

	return shareLinks, total, nil
}

// GetShareLinkByToken returns a share link by its token
func (ss *ShareService) GetShareLinkByToken(token string) (*models.ShareLink, error) {
	var shareLink models.ShareLink
	if err := ss.db.Preload("User").Preload("File").Preload("Folder").
		Where("token = ?", token).First(&shareLink).Error; err != nil {
		return nil, err
	}

	return &shareLink, nil
}

// UpdateShareLink updates an existing share link
func (ss *ShareService) UpdateShareLink(userID uuid.UUID, linkID uuid.UUID, req models.ShareLinkUpdateRequest) (*models.ShareLink, error) {
	var shareLink models.ShareLink
	if err := ss.db.Where("id = ? AND user_id = ?", linkID, userID).First(&shareLink).Error; err != nil {
		return nil, errors.New("share link not found")
	}

	// Update fields
	updates := make(map[string]interface{})

	if req.Permission != "" {
		updates["permission"] = req.Permission
	}

	if req.ExpiresAt != nil {
		updates["expires_at"] = req.ExpiresAt
	}

	updates["allow_download"] = req.AllowDownload

	// Handle password update
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		updates["password"] = string(hashedPassword)
		updates["has_password"] = true
	} else if req.Password == "" && shareLink.HasPassword {
		// Remove password if empty string is provided
		updates["password"] = ""
		updates["has_password"] = false
	}

	if err := ss.db.Model(&shareLink).Updates(updates).Error; err != nil {
		return nil, err
	}

	// Reload with relationships
	ss.loadShareLinkRelations(&shareLink)

	return &shareLink, nil
}

// DeleteShareLink deletes a share link
func (ss *ShareService) DeleteShareLink(userID uuid.UUID, linkID uuid.UUID) error {
	return ss.db.Where("id = ? AND user_id = ?", linkID, userID).Delete(&models.ShareLink{}).Error
}

// AccessShareLink handles public access to a share link
func (ss *ShareService) AccessShareLink(token, password string) (*models.ShareLink, error) {
	shareLink, err := ss.GetShareLinkByToken(token)
	if err != nil {
		return nil, errors.New("share link not found")
	}

	// Check if expired
	if shareLink.IsExpired() {
		return nil, errors.New("share link has expired")
	}

	// Check password if required
	if shareLink.HasPassword {
		if password == "" {
			return nil, errors.New("password required")
		}
		if err := bcrypt.CompareHashAndPassword([]byte(shareLink.Password), []byte(password)); err != nil {
			return nil, errors.New("invalid password")
		}
	}

	// Increment view count
	ss.db.Model(shareLink).UpdateColumn("view_count", gorm.Expr("view_count + 1"))

	return shareLink, nil
}

// IncrementDownloadCount increments the download count for a share link
func (ss *ShareService) IncrementDownloadCount(token string) error {
	return ss.db.Model(&models.ShareLink{}).Where("token = ?", token).
		UpdateColumn("download_count", gorm.Expr("download_count + 1")).Error
}

// GetFileShareLinks returns all share links for a specific file
func (ss *ShareService) GetFileShareLinks(userID, fileID uuid.UUID) ([]models.ShareLink, error) {
	var shareLinks []models.ShareLink
	if err := ss.db.Preload("User").
		Where("user_id = ? AND file_id = ?", userID, fileID).
		Find(&shareLinks).Error; err != nil {
		return nil, err
	}
	return shareLinks, nil
}

// GetFolderShareLinks returns all share links for a specific folder
func (ss *ShareService) GetFolderShareLinks(userID, folderID uuid.UUID) ([]models.ShareLink, error) {
	var shareLinks []models.ShareLink
	if err := ss.db.Preload("User").
		Where("user_id = ? AND folder_id = ?", userID, folderID).
		Find(&shareLinks).Error; err != nil {
		return nil, err
	}
	return shareLinks, nil
}

// CleanupExpiredLinks removes expired share links
func (ss *ShareService) CleanupExpiredLinks() error {
	return ss.db.Where("expires_at < ?", time.Now()).Delete(&models.ShareLink{}).Error
}

// GetShareStats returns sharing statistics for a user
func (ss *ShareService) GetShareStats(userID uuid.UUID) (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Total share links
	var totalLinks int64
	ss.db.Model(&models.ShareLink{}).Where("user_id = ?", userID).Count(&totalLinks)

	// Active links (not expired)
	var activeLinks int64
	ss.db.Model(&models.ShareLink{}).
		Where("user_id = ? AND (expires_at IS NULL OR expires_at > ?)", userID, time.Now()).
		Count(&activeLinks)

	// Total views
	var totalViews int64
	ss.db.Model(&models.ShareLink{}).Where("user_id = ?", userID).
		Select("COALESCE(SUM(view_count), 0)").Scan(&totalViews)

	// Total downloads
	var totalDownloads int64
	ss.db.Model(&models.ShareLink{}).Where("user_id = ?", userID).
		Select("COALESCE(SUM(download_count), 0)").Scan(&totalDownloads)

	// Links by permission
	var permissionStats []struct {
		Permission string
		Count      int64
	}
	ss.db.Model(&models.ShareLink{}).
		Select("permission, COUNT(*) as count").
		Where("user_id = ?", userID).
		Group("permission").
		Scan(&permissionStats)

	stats["total_links"] = totalLinks
	stats["active_links"] = activeLinks
	stats["total_views"] = totalViews
	stats["total_downloads"] = totalDownloads
	stats["permission_breakdown"] = permissionStats

	return stats, nil
}

// Helper function to load relationships
func (ss *ShareService) loadShareLinkRelations(shareLink *models.ShareLink) {
	ss.db.Preload("User").Preload("File").Preload("Folder").
		Where("id = ?", shareLink.ID).First(shareLink)
}

// generateSecureToken generates a cryptographically secure random token
func generateSecureToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

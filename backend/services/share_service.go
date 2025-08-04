package services

import (
	"context"
	"fmt"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"github.com/manjurulhoque/swift-share/backend/storage"
)

type ShareService struct {
	storageService storage.StorageService
}

func NewShareService(storageService storage.StorageService) *ShareService {
	return &ShareService{
		storageService: storageService,
	}
}

// CreateShareLinkWithExpiration creates a share link with a specific expiration time
func (s *ShareService) CreateShareLinkWithExpiration(ctx context.Context, userID, fileID uuid.UUID, req models.ShareLinkCreateRequest) (*models.ShareLink, error) {
	// Validate file exists and belongs to user
	var file models.File
	if err := database.GetDB().Where("id = ? AND user_id = ?", fileID, userID).First(&file).Error; err != nil {
		return nil, fmt.Errorf("file not found: %w", err)
	}

	// Create share link
	shareLink := models.ShareLink{
		UserID:       userID,
		FileID:       fileID,
		Password:     req.Password,
		ExpiresAt:    req.ExpiresAt,
		MaxDownloads: req.MaxDownloads,
		Description:  req.Description,
	}

	if err := database.GetDB().Create(&shareLink).Error; err != nil {
		return nil, fmt.Errorf("failed to create share link: %w", err)
	}

	return &shareLink, nil
}

// GeneratePresignedDownloadURL generates a pre-signed URL for downloading a shared file
func (s *ShareService) GeneratePresignedDownloadURL(ctx context.Context, token string, expiration time.Duration) (string, error) {
	var shareLink models.ShareLink
	if err := database.GetDB().Where("token = ?", token).First(&shareLink).Error; err != nil {
		return "", fmt.Errorf("share link not found: %w", err)
	}

	// Check if share link is accessible
	if !shareLink.IsAccessible() {
		return "", fmt.Errorf("share link is not accessible")
	}

	// Get file information with user data
	var file models.File
	if err := database.GetDB().Preload("User").Where("id = ?", shareLink.FileID).First(&file).Error; err != nil {
		return "", fmt.Errorf("file not found: %w", err)
	}

	// For S3, we need to construct the full key path
	// The key should be: userID/fileName (same as upload)
	s3Key := filepath.Join(file.UserID.String(), file.FileName)

	// Debug logging (remove in production)
	fmt.Printf("Debug: Checking file existence for key: %s\n", s3Key)

	// Check if file exists in storage
	exists, err := s.storageService.FileExists(ctx, s3Key)
	if err != nil {
		return "", fmt.Errorf("failed to check file existence: %w", err)
	}
	if !exists {
		return "", fmt.Errorf("file not found in storage with key: %s", s3Key)
	}

	// Generate pre-signed URL
	fmt.Printf("Debug: Generating pre-signed URL for key: %s with expiration: %v\n", s3Key, expiration)
	url, err := s.storageService.GeneratePresignedURL(ctx, s3Key, expiration)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return url, nil
}

// ValidateShareLink validates a share link and returns the associated file
func (s *ShareService) ValidateShareLink(ctx context.Context, token string, password string) (*models.ShareLink, *models.File, error) {
	var shareLink models.ShareLink
	if err := database.GetDB().Preload("File").Where("token = ?", token).First(&shareLink).Error; err != nil {
		return nil, nil, fmt.Errorf("share link not found: %w", err)
	}

	// Check if share link is accessible
	if !shareLink.IsAccessible() {
		return nil, nil, fmt.Errorf("share link is not accessible")
	}

	// Check password if required
	if shareLink.Password != "" {
		if password == "" {
			return nil, nil, fmt.Errorf("password required")
		}
		if !shareLink.CheckPassword(password) {
			return nil, nil, fmt.Errorf("invalid password")
		}
	}

	return &shareLink, &shareLink.File, nil
}

// IncrementDownloadCount increments the download count for both share link and file
func (s *ShareService) IncrementDownloadCount(shareLinkID, fileID uuid.UUID) error {
	// Increment share link download count
	if err := database.GetDB().Model(&models.ShareLink{}).Where("id = ?", shareLinkID).Update("download_count", database.GetDB().Raw("download_count + 1")).Error; err != nil {
		return fmt.Errorf("failed to increment share link download count: %w", err)
	}

	// Increment file download count
	if err := database.GetDB().Model(&models.File{}).Where("id = ?", fileID).Update("download_count", database.GetDB().Raw("download_count + 1")).Error; err != nil {
		return fmt.Errorf("failed to increment file download count: %w", err)
	}

	return nil
}

// GetShareLinkByToken retrieves a share link by token with file information
func (s *ShareService) GetShareLinkByToken(ctx context.Context, token string) (*models.ShareLink, error) {
	var shareLink models.ShareLink
	if err := database.GetDB().Preload("File.User").Preload("User").Where("token = ?", token).First(&shareLink).Error; err != nil {
		return nil, fmt.Errorf("share link not found: %w", err)
	}
	return &shareLink, nil
}

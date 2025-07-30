package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ShareLink struct {
	ID            uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	UserID        uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index"`
	FileID        uuid.UUID      `json:"file_id" gorm:"type:uuid;not null;index"`
	Token         string         `json:"token" gorm:"uniqueIndex;size:255;not null" validate:"required"`
	Password      string         `json:"-" gorm:"size:255"`
	ExpiresAt     *time.Time     `json:"expires_at"`
	MaxDownloads  int            `json:"max_downloads" gorm:"default:0"` // 0 means unlimited
	DownloadCount int            `json:"download_count" gorm:"default:0"`
	IsActive      bool           `json:"is_active" gorm:"default:true"`
	Description   string         `json:"description" gorm:"size:500"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	User      User       `json:"user,omitempty" gorm:"foreignKey:UserID"`
	File      File       `json:"file,omitempty" gorm:"foreignKey:FileID"`
	Downloads []Download `json:"downloads,omitempty" gorm:"foreignKey:ShareLinkID"`
}

type ShareLinkCreateRequest struct {
	FileID       uuid.UUID  `json:"file_id" validate:"required"`
	Password     string     `json:"password" validate:"omitempty,min=4,max=50"`
	ExpiresAt    *time.Time `json:"expires_at"`
	MaxDownloads int        `json:"max_downloads" validate:"omitempty,min=0"`
	Description  string     `json:"description" validate:"omitempty,max=500"`
}

type ShareLinkResponse struct {
	ID            uuid.UUID    `json:"id"`
	Token         string       `json:"token"`
	ExpiresAt     *time.Time   `json:"expires_at"`
	MaxDownloads  int          `json:"max_downloads"`
	DownloadCount int          `json:"download_count"`
	IsActive      bool         `json:"is_active"`
	Description   string       `json:"description"`
	HasPassword   bool         `json:"has_password"`
	CreatedAt     time.Time    `json:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
	File          FileResponse `json:"file,omitempty"`
	User          UserResponse `json:"user,omitempty"`
}

type ShareLinkUpdateRequest struct {
	Password     string     `json:"password" validate:"omitempty,min=4,max=50"`
	ExpiresAt    *time.Time `json:"expires_at"`
	MaxDownloads int        `json:"max_downloads" validate:"omitempty,min=0"`
	Description  string     `json:"description" validate:"omitempty,max=500"`
	IsActive     bool       `json:"is_active"`
}

type ShareLinkAccessRequest struct {
	Token    string `json:"token" validate:"required"`
	Password string `json:"password"`
}

// BeforeCreate hook to set UUID and generate token
func (s *ShareLink) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}

	if s.Token == "" {
		s.Token = generateRandomToken(32)
	}

	return nil
}

// ToResponse converts ShareLink to ShareLinkResponse
func (s *ShareLink) ToResponse() ShareLinkResponse {
	response := ShareLinkResponse{
		ID:            s.ID,
		Token:         s.Token,
		ExpiresAt:     s.ExpiresAt,
		MaxDownloads:  s.MaxDownloads,
		DownloadCount: s.DownloadCount,
		IsActive:      s.IsActive,
		Description:   s.Description,
		HasPassword:   s.Password != "",
		CreatedAt:     s.CreatedAt,
		UpdatedAt:     s.UpdatedAt,
	}

	if s.File.ID != uuid.Nil {
		response.File = s.File.ToResponse()
	}

	if s.User.ID != uuid.Nil {
		response.User = s.User.ToResponse()
	}

	return response
}

// IsExpired checks if the share link has expired
func (s *ShareLink) IsExpired() bool {
	if s.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*s.ExpiresAt)
}

// IsDownloadLimitReached checks if download limit is reached
func (s *ShareLink) IsDownloadLimitReached() bool {
	if s.MaxDownloads == 0 {
		return false
	}
	return s.DownloadCount >= s.MaxDownloads
}

// IsAccessible checks if the share link can be accessed
func (s *ShareLink) IsAccessible() bool {
	return s.IsActive && !s.IsExpired() && !s.IsDownloadLimitReached()
}

// CheckPassword verifies the share link password
func (s *ShareLink) CheckPassword(password string) bool {
	if s.Password == "" {
		return true // No password required
	}
	return s.Password == password // Simple comparison, could be hashed in production
}

// generateRandomToken generates a random token for share links
func generateRandomToken(length int) string {
	// Simple token generation - in production, use crypto/rand
	return uuid.New().String()[:length]
}

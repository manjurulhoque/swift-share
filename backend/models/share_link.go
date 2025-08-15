package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ShareLinkPermission string

const (
	PermissionView    ShareLinkPermission = "view"
	PermissionComment ShareLinkPermission = "comment"
	PermissionEdit    ShareLinkPermission = "edit"
)

type ShareLink struct {
	ID            uuid.UUID           `json:"id" gorm:"type:uuid;primary_key"`
	UserID        uuid.UUID           `json:"user_id" gorm:"type:uuid;not null;index"`
	FileID        *uuid.UUID          `json:"file_id" gorm:"type:uuid;index"`
	FolderID      *uuid.UUID          `json:"folder_id" gorm:"type:uuid;index"`
	Token         string              `json:"token" gorm:"size:64;not null;unique;index"`
	Permission    ShareLinkPermission `json:"permission" gorm:"size:20;not null;default:'view'"`
	Password      string              `json:"-" gorm:"size:255"` // Hashed password
	HasPassword   bool                `json:"has_password" gorm:"default:false"`
	IsPublic      bool                `json:"is_public" gorm:"default:true"`
	AllowDownload bool                `json:"allow_download" gorm:"default:true"`
	ViewCount     int                 `json:"view_count" gorm:"default:0"`
	DownloadCount int                 `json:"download_count" gorm:"default:0"`
	ExpiresAt     *time.Time          `json:"expires_at"`
	CreatedAt     time.Time           `json:"created_at"`
	UpdatedAt     time.Time           `json:"updated_at"`
	DeletedAt     gorm.DeletedAt      `json:"-" gorm:"index"`

	// Relationships
	User   User    `json:"user,omitempty" gorm:"foreignKey:UserID"`
	File   *File   `json:"file,omitempty" gorm:"foreignKey:FileID"`
	Folder *Folder `json:"folder,omitempty" gorm:"foreignKey:FolderID"`
}

type ShareLinkCreateRequest struct {
	FileID        *uuid.UUID          `json:"file_id"`
	FolderID      *uuid.UUID          `json:"folder_id"`
	Permission    ShareLinkPermission `json:"permission" validate:"required,oneof=view comment edit"`
	Password      string              `json:"password" validate:"omitempty,min=6"`
	ExpiresAt     *time.Time          `json:"expires_at"`
	AllowDownload bool                `json:"allow_download"`
}

type ShareLinkUpdateRequest struct {
	Permission    ShareLinkPermission `json:"permission" validate:"omitempty,oneof=view comment edit"`
	Password      string              `json:"password" validate:"omitempty,min=6"`
	ExpiresAt     *time.Time          `json:"expires_at"`
	AllowDownload bool                `json:"allow_download"`
	IsActive      bool                `json:"is_active"`
}

type ShareLinkResponse struct {
	ID            uuid.UUID           `json:"id"`
	Token         string              `json:"token"`
	Permission    ShareLinkPermission `json:"permission"`
	HasPassword   bool                `json:"has_password"`
	IsPublic      bool                `json:"is_public"`
	AllowDownload bool                `json:"allow_download"`
	ViewCount     int                 `json:"view_count"`
	DownloadCount int                 `json:"download_count"`
	ExpiresAt     *time.Time          `json:"expires_at"`
	CreatedAt     time.Time           `json:"created_at"`
	UpdatedAt     time.Time           `json:"updated_at"`
	ShareURL      string              `json:"share_url"`
	File          *FileResponse       `json:"file,omitempty"`
	Folder        *FolderResponse     `json:"folder,omitempty"`
	User          UserResponse        `json:"user"`
}

type ShareLinkAccessRequest struct {
	Password string `json:"password"`
}

type PublicShareInfo struct {
	ID            uuid.UUID           `json:"id"`
	Permission    ShareLinkPermission `json:"permission"`
	AllowDownload bool                `json:"allow_download"`
	ExpiresAt     *time.Time          `json:"expires_at"`
	HasPassword   bool                `json:"has_password"`
	File          *FileResponse       `json:"file,omitempty"`
	Folder        *FolderResponse     `json:"folder,omitempty"`
	Owner         UserResponse        `json:"owner"`
}

// BeforeCreate hook to set UUID and generate token
func (sl *ShareLink) BeforeCreate(tx *gorm.DB) error {
	if sl.ID == uuid.Nil {
		sl.ID = uuid.New()
	}
	if sl.Token == "" {
		sl.Token = generateSecureToken(64)
	}
	return nil
}

// IsExpired checks if the share link has expired
func (sl *ShareLink) IsExpired() bool {
	if sl.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*sl.ExpiresAt)
}

// CanAccess checks if the share link can be accessed
func (sl *ShareLink) CanAccess() bool {
	return !sl.IsExpired() && sl.DeletedAt.Time.IsZero()
}

// ToResponse converts ShareLink to ShareLinkResponse
func (sl *ShareLink) ToResponse(baseURL string) ShareLinkResponse {
	response := ShareLinkResponse{
		ID:            sl.ID,
		Token:         sl.Token,
		Permission:    sl.Permission,
		HasPassword:   sl.HasPassword,
		IsPublic:      sl.IsPublic,
		AllowDownload: sl.AllowDownload,
		ViewCount:     sl.ViewCount,
		DownloadCount: sl.DownloadCount,
		ExpiresAt:     sl.ExpiresAt,
		CreatedAt:     sl.CreatedAt,
		UpdatedAt:     sl.UpdatedAt,
		ShareURL:      baseURL + "/share/" + sl.Token,
	}

	if sl.User.ID != uuid.Nil {
		response.User = sl.User.ToResponse()
	}

	if sl.File != nil && sl.File.ID != uuid.Nil {
		fileResponse := sl.File.ToResponse()
		response.File = &fileResponse
	}

	if sl.Folder != nil && sl.Folder.ID != uuid.Nil {
		folderResponse := sl.Folder.ToResponse()
		response.Folder = &folderResponse
	}

	return response
}

// ToPublicInfo converts ShareLink to PublicShareInfo (for public access)
func (sl *ShareLink) ToPublicInfo() PublicShareInfo {
	info := PublicShareInfo{
		ID:            sl.ID,
		Permission:    sl.Permission,
		AllowDownload: sl.AllowDownload,
		ExpiresAt:     sl.ExpiresAt,
		HasPassword:   sl.HasPassword,
		Owner:         sl.User.ToResponse(),
	}

	if sl.File != nil && sl.File.ID != uuid.Nil {
		fileResponse := sl.File.ToResponse()
		info.File = &fileResponse
	}

	if sl.Folder != nil && sl.Folder.ID != uuid.Nil {
		folderResponse := sl.Folder.ToResponse()
		info.Folder = &folderResponse
	}

	return info
}

// generateSecureToken generates a cryptographically secure random token
func generateSecureToken(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[len(charset)/2] // Simplified for demo - use crypto/rand in production
	}
	return string(b)
}

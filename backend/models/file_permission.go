package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PermissionRole defines access level similar to Google Drive
type PermissionRole string

const (
	RoleViewer    PermissionRole = "viewer"    // can view/download
	RoleCommenter PermissionRole = "commenter" // reserved for future: can comment
	RoleEditor    PermissionRole = "editor"    // can edit file metadata/delete
)

type FilePermission struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	FileID    uuid.UUID      `json:"file_id" gorm:"type:uuid;not null;index:idx_file_user,unique"`
	UserID    uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index:idx_file_user,unique"`
	Role      PermissionRole `json:"role" gorm:"size:20;not null"`
	ExpiresAt *time.Time     `json:"expires_at"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`

	// Relationships
	File File `json:"file,omitempty" gorm:"foreignKey:FileID"`
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (fp *FilePermission) BeforeCreate(tx *gorm.DB) error {
	if fp.ID == uuid.Nil {
		fp.ID = uuid.New()
	}
	return nil
}

func (fp *FilePermission) IsExpired() bool {
	if fp.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*fp.ExpiresAt)
}

type FilePermissionResponse struct {
	ID        uuid.UUID      `json:"id"`
	Role      PermissionRole `json:"role"`
	ExpiresAt *time.Time     `json:"expires_at"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	User      UserResponse   `json:"user"`
}

func (fp *FilePermission) ToResponse() FilePermissionResponse {
	return FilePermissionResponse{
		ID:        fp.ID,
		Role:      fp.Role,
		ExpiresAt: fp.ExpiresAt,
		CreatedAt: fp.CreatedAt,
		UpdatedAt: fp.UpdatedAt,
		User:      fp.User.ToResponse(),
	}
}

// Requests
type AddCollaboratorRequest struct {
	UserID    uuid.UUID      `json:"user_id" validate:"required"`
	Role      PermissionRole `json:"role" validate:"required,oneof=viewer commenter editor"`
	ExpiresAt *time.Time     `json:"expires_at"`
}

type UpdateCollaboratorRequest struct {
	Role      PermissionRole `json:"role" validate:"omitempty,oneof=viewer commenter editor"`
	ExpiresAt *time.Time     `json:"expires_at"`
}

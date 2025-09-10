package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CollaboratorRole defines access level similar to Google Drive
type CollaboratorRole string

const (
	RoleViewer    CollaboratorRole = "viewer"    // can view/download
	RoleCommenter CollaboratorRole = "commenter" // reserved for future: can comment
	RoleEditor    CollaboratorRole = "editor"    // can edit file metadata/delete
)

type Collaborator struct {
	ID        uuid.UUID        `json:"id" gorm:"type:uuid;primary_key"`
	FileID    *uuid.UUID       `json:"file_id" gorm:"type:uuid;index"`   // nullable for folder collaborations
	FolderID  *uuid.UUID       `json:"folder_id" gorm:"type:uuid;index"` // nullable for file collaborations
	UserID    uuid.UUID        `json:"user_id" gorm:"type:uuid;not null;index"`
	Role      CollaboratorRole `json:"role" gorm:"size:20;not null"`
	ExpiresAt *time.Time       `json:"expires_at"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`

	// Relationships
	File   *File   `json:"file,omitempty" gorm:"foreignKey:FileID"`
	Folder *Folder `json:"folder,omitempty" gorm:"foreignKey:FolderID"`
	User   User    `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (c *Collaborator) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

func (c *Collaborator) IsExpired() bool {
	if c.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*c.ExpiresAt)
}

func (c *Collaborator) TableName() string {
	return "collaborators"
}

type CollaboratorResponse struct {
	ID        uuid.UUID        `json:"id"`
	Role      CollaboratorRole `json:"role"`
	ExpiresAt *time.Time       `json:"expires_at"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`
	User      UserResponse     `json:"user"`
}

func (c *Collaborator) ToResponse() CollaboratorResponse {
	return CollaboratorResponse{
		ID:        c.ID,
		Role:      c.Role,
		ExpiresAt: c.ExpiresAt,
		CreatedAt: c.CreatedAt,
		UpdatedAt: c.UpdatedAt,
		User:      c.User.ToResponse(),
	}
}

// Requests
type AddCollaboratorRequest struct {
	UserID    uuid.UUID        `json:"user_id" validate:"required"`
	Role      CollaboratorRole `json:"role" validate:"required,oneof=viewer commenter editor"`
	ExpiresAt *time.Time       `json:"expires_at"`
}

type UpdateCollaboratorRequest struct {
	Role      CollaboratorRole `json:"role" validate:"omitempty,oneof=viewer commenter editor"`
	ExpiresAt *time.Time       `json:"expires_at"`
}

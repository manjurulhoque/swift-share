package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuditLog struct {
	ID         uuid.UUID  `json:"id" gorm:"type:uuid;primary_key"`
	UserID     *uuid.UUID `json:"user_id" gorm:"type:uuid;index"` // Nullable for system events
	Action     string     `json:"action" gorm:"size:100;not null" validate:"required"`
	Resource   string     `json:"resource" gorm:"size:100;not null" validate:"required"`
	ResourceID *uuid.UUID `json:"resource_id" gorm:"type:uuid;index"`
	Details    string     `json:"details" gorm:"type:text"`
	IPAddress  string     `json:"ip_address" gorm:"size:45"`
	UserAgent  string     `json:"user_agent" gorm:"size:500"`
	Status     string     `json:"status" gorm:"size:20;not null" validate:"required,oneof=success failure"`
	CreatedAt  time.Time  `json:"created_at"`

	// Relationships
	User *User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type AuditLogResponse struct {
	ID         uuid.UUID     `json:"id"`
	Action     string        `json:"action"`
	Resource   string        `json:"resource"`
	ResourceID *uuid.UUID    `json:"resource_id"`
	Details    string        `json:"details"`
	IPAddress  string        `json:"ip_address"`
	UserAgent  string        `json:"user_agent"`
	Status     string        `json:"status"`
	CreatedAt  time.Time     `json:"created_at"`
	User       *UserResponse `json:"user,omitempty"`
}

type AuditLogCreateRequest struct {
	Action     string     `json:"action" validate:"required"`
	Resource   string     `json:"resource" validate:"required"`
	ResourceID *uuid.UUID `json:"resource_id"`
	Details    string     `json:"details"`
	Status     string     `json:"status" validate:"required,oneof=success failure"`
}

// Common audit actions
const (
	ActionLogin          = "login"
	ActionLogout         = "logout"
	ActionRegister       = "register"
	ActionTokenRefresh   = "token_refresh"
	ActionFileUpload     = "file_upload"
	ActionFileDownload   = "file_download"
	ActionFileDelete     = "file_delete"
	ActionFileUpdate     = "file_update"
	ActionFileMove       = "file_move"
	ActionFolderCreate   = "folder_create"
	ActionFolderUpdate   = "folder_update"
	ActionFolderDelete   = "folder_delete"
	ActionFolderMove     = "folder_move"
	ActionShareCreate    = "share_create"
	ActionShareAccess    = "share_access"
	ActionShareUpdate    = "share_update"
	ActionShareDelete    = "share_delete"
	ActionUserUpdate     = "user_update"
	ActionUserDelete     = "user_delete"
	ActionPasswordChange = "password_change"
)

// Common audit resources
const (
	ResourceUser         = "user"
	ResourceFile         = "file"
	ResourceFolder       = "folder"
	ResourceCollaborator = "collaborator"
	ResourceAuth         = "auth"
	ResourceSystem       = "system"
)

// Common audit statuses
const (
	StatusSuccess = "success"
	StatusFailure = "failure"
)

// BeforeCreate hook to set UUID
func (a *AuditLog) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

// ToResponse converts AuditLog to AuditLogResponse
func (a *AuditLog) ToResponse() AuditLogResponse {
	response := AuditLogResponse{
		ID:         a.ID,
		Action:     a.Action,
		Resource:   a.Resource,
		ResourceID: a.ResourceID,
		Details:    a.Details,
		IPAddress:  a.IPAddress,
		UserAgent:  a.UserAgent,
		Status:     a.Status,
		CreatedAt:  a.CreatedAt,
	}

	if a.User != nil && a.User.ID != uuid.Nil {
		userResponse := a.User.ToResponse()
		response.User = &userResponse
	}

	return response
}

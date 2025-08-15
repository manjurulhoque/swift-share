package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileAccess struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	FileID    uuid.UUID `json:"file_id" gorm:"type:uuid;not null;index"`
	Action    string    `json:"action" gorm:"size:50;not null"` // view, download, edit
	CreatedAt time.Time `json:"created_at"`

	// Relationships
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
	File File `json:"file,omitempty" gorm:"foreignKey:FileID"`
}

// Common access actions
const (
	ActionView     = "view"
	ActionDownload = "download"
	ActionEdit     = "edit"
)

func (fa *FileAccess) BeforeCreate(tx *gorm.DB) error {
	if fa.ID == uuid.Nil {
		fa.ID = uuid.New()
	}
	return nil
}

func (fa *FileAccess) TableName() string {
	return "file_access_logs"
}

type FileAccessResponse struct {
	ID        uuid.UUID    `json:"id"`
	Action    string       `json:"action"`
	CreatedAt time.Time    `json:"created_at"`
	File      FileResponse `json:"file"`
}

func (fa *FileAccess) ToResponse() FileAccessResponse {
	return FileAccessResponse{
		ID:        fa.ID,
		Action:    fa.Action,
		CreatedAt: fa.CreatedAt,
		File:      fa.File.ToResponse(),
	}
}

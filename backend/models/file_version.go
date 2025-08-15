package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileVersion struct {
	ID            uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	FileID        uuid.UUID      `json:"file_id" gorm:"type:uuid;not null;index"`
	UserID        uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index"`
	VersionNumber int            `json:"version_number" gorm:"not null;index"`
	FileName      string         `json:"file_name" gorm:"size:255;not null"`
	FilePath      string         `json:"file_path" gorm:"size:500;not null"`
	FileSize      int64          `json:"file_size" gorm:"not null"`
	MimeType      string         `json:"mime_type" gorm:"size:100;not null"`
	Checksum      string         `json:"checksum" gorm:"size:64;not null;index"` // SHA-256 hash
	Comment       string         `json:"comment" gorm:"size:500"`
	IsAutoSave    bool           `json:"is_auto_save" gorm:"default:false"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	File File `json:"file,omitempty" gorm:"foreignKey:FileID"`
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type FileVersionCreateRequest struct {
	Comment    string `json:"comment" validate:"omitempty,max=500"`
	IsAutoSave bool   `json:"is_auto_save"`
}

type FileVersionResponse struct {
	ID            uuid.UUID    `json:"id"`
	VersionNumber int          `json:"version_number"`
	FileName      string       `json:"file_name"`
	FileSize      int64        `json:"file_size"`
	MimeType      string       `json:"mime_type"`
	Checksum      string       `json:"checksum"`
	Comment       string       `json:"comment"`
	IsAutoSave    bool         `json:"is_auto_save"`
	CreatedAt     time.Time    `json:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
	User          UserResponse `json:"user"`
}

type FileVersionsResponse struct {
	Versions     []FileVersionResponse `json:"versions"`
	CurrentFile  FileResponse          `json:"current_file"`
	TotalSize    int64                 `json:"total_size"`
	VersionCount int                   `json:"version_count"`
}

type RestoreVersionRequest struct {
	Comment string `json:"comment" validate:"omitempty,max=500"`
}

// BeforeCreate hook to set UUID
func (fv *FileVersion) BeforeCreate(tx *gorm.DB) error {
	if fv.ID == uuid.Nil {
		fv.ID = uuid.New()
	}
	return nil
}

// ToResponse converts FileVersion to FileVersionResponse
func (fv *FileVersion) ToResponse() FileVersionResponse {
	response := FileVersionResponse{
		ID:            fv.ID,
		VersionNumber: fv.VersionNumber,
		FileName:      fv.FileName,
		FileSize:      fv.FileSize,
		MimeType:      fv.MimeType,
		Checksum:      fv.Checksum,
		Comment:       fv.Comment,
		IsAutoSave:    fv.IsAutoSave,
		CreatedAt:     fv.CreatedAt,
		UpdatedAt:     fv.UpdatedAt,
	}

	if fv.User.ID != uuid.Nil {
		response.User = fv.User.ToResponse()
	}

	return response
}

// GetDisplayName returns a user-friendly display name for the version
func (fv *FileVersion) GetDisplayName() string {
	if fv.Comment != "" {
		return fv.Comment
	}
	if fv.IsAutoSave {
		return "Auto-saved version"
	}
	return "Manual save"
}

// IsCurrent checks if this version is the current version
func (fv *FileVersion) IsCurrent(currentChecksum string) bool {
	return fv.Checksum == currentChecksum
}

// GetFormattedSize returns a human-readable file size
func (fv *FileVersion) GetFormattedSize() string {
	const unit = 1024
	if fv.FileSize < unit {
		return "< 1 KB"
	}
	div, exp := int64(unit), 0
	for n := fv.FileSize / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(fv.FileSize)/float64(div), "KMGTPE"[exp])
}

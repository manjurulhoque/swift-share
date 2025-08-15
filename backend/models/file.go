package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type File struct {
	ID            uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	UserID        uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index"`
	FolderID      *uuid.UUID     `json:"folder_id" gorm:"type:uuid;index"` // null for root files
	FileName      string         `json:"file_name" gorm:"size:255;not null" validate:"required"`
	OriginalName  string         `json:"original_name" gorm:"size:255;not null" validate:"required"`
	FilePath      string         `json:"file_path" gorm:"size:500;not null" validate:"required"`
	FileSize      int64          `json:"file_size" gorm:"not null" validate:"required,min=1"`
	MimeType      string         `json:"mime_type" gorm:"size:100;not null" validate:"required"`
	FileExtension string         `json:"file_extension" gorm:"size:10;not null" validate:"required"`
	IsPublic      bool           `json:"is_public" gorm:"default:false"`
	IsStarred     bool           `json:"is_starred" gorm:"default:false"`
	IsTrashed     bool           `json:"is_trashed" gorm:"default:false;index"`
	TrashedAt     *time.Time     `json:"trashed_at,omitempty"`
	DownloadCount int            `json:"download_count" gorm:"default:0"`
	Description   string         `json:"description" gorm:"size:500"`
	Tags          string         `json:"tags" gorm:"size:255"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	User          User           `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Folder        *Folder        `json:"folder,omitempty" gorm:"foreignKey:FolderID"`
	Collaborators []Collaborator `json:"collaborators,omitempty" gorm:"foreignKey:FileID"`
	Downloads     []Download     `json:"downloads,omitempty" gorm:"foreignKey:FileID"`
}

type FileUploadRequest struct {
	Description string     `json:"description" validate:"omitempty,max=500"`
	Tags        string     `json:"tags" validate:"omitempty,max=255"`
	IsPublic    bool       `json:"is_public"`
	FolderID    *uuid.UUID `json:"folder_id"`
}

type FileResponse struct {
	ID            uuid.UUID       `json:"id"`
	FolderID      *uuid.UUID      `json:"folder_id"`
	FileName      string          `json:"file_name"`
	OriginalName  string          `json:"original_name"`
	FileSize      int64           `json:"file_size"`
	MimeType      string          `json:"mime_type"`
	FileExtension string          `json:"file_extension"`
	IsPublic      bool            `json:"is_public"`
	IsStarred     bool            `json:"is_starred"`
	IsTrashed     bool            `json:"is_trashed"`
	TrashedAt     *time.Time      `json:"trashed_at,omitempty"`
	DownloadCount int             `json:"download_count"`
	Description   string          `json:"description"`
	Tags          string          `json:"tags"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
	User          UserResponse    `json:"user,omitempty"`
	Folder        *FolderResponse `json:"folder,omitempty"`
}

type FileUpdateRequest struct {
	Description string `json:"description" validate:"omitempty,max=500"`
	Tags        string `json:"tags" validate:"omitempty,max=255"`
	IsPublic    bool   `json:"is_public"`
	IsStarred   bool   `json:"is_starred"`
}

// BeforeCreate hook to set UUID
func (f *File) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}
	return nil
}

// ToResponse converts File to FileResponse
func (f *File) ToResponse() FileResponse {
	response := FileResponse{
		ID:            f.ID,
		FolderID:      f.FolderID,
		FileName:      f.FileName,
		OriginalName:  f.OriginalName,
		FileSize:      f.FileSize,
		MimeType:      f.MimeType,
		FileExtension: f.FileExtension,
		IsPublic:      f.IsPublic,
		IsStarred:     f.IsStarred,
		IsTrashed:     f.IsTrashed,
		TrashedAt:     f.TrashedAt,
		DownloadCount: f.DownloadCount,
		Description:   f.Description,
		Tags:          f.Tags,
		CreatedAt:     f.CreatedAt,
		UpdatedAt:     f.UpdatedAt,
	}

	if f.User.ID != uuid.Nil {
		response.User = f.User.ToResponse()
	}

	if f.Folder != nil {
		folderResponse := f.Folder.ToResponse()
		response.Folder = &folderResponse
	}

	return response
}

// GetFormattedFileSize returns human-readable file size
func (f *File) GetFormattedFileSize() string {
	const unit = 1024
	if f.FileSize < unit {
		return formatSize(f.FileSize, "B")
	}

	div, exp := int64(unit), 0
	for n := f.FileSize / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}

	units := []string{"KB", "MB", "GB", "TB"}
	return formatSize(f.FileSize/div, units[exp])
}

func formatSize(size int64, unit string) string {
	// Simple formatting without external dependencies
	return string(rune(size)) + " " + unit
}

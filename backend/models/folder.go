package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Folder struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	UserID    uuid.UUID      `json:"user_id" gorm:"type:uuid;not null;index"`
	ParentID  *uuid.UUID     `json:"parent_id" gorm:"type:uuid;index"` // null for root folders
	Name      string         `json:"name" gorm:"size:255;not null" validate:"required,max=255"`
	Path      string         `json:"path" gorm:"size:1000;not null;index"` // full path for efficient querying
	IsShared  bool           `json:"is_shared" gorm:"default:false"`
	IsTrashed bool           `json:"is_trashed" gorm:"default:false;index"`
	TrashedAt *time.Time     `json:"trashed_at,omitempty"`
	Color     string         `json:"color" gorm:"size:7"` // hex color code
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	User          User           `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Parent        *Folder        `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Subfolders    []Folder       `json:"subfolders,omitempty" gorm:"foreignKey:ParentID"`
	Files         []File         `json:"files,omitempty" gorm:"foreignKey:FolderID"`
	Collaborators []Collaborator `json:"collaborators,omitempty" gorm:"foreignKey:FolderID"`
}

// BeforeCreate hook to set UUID and path
func (f *Folder) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}

	// Set path based on parent
	if f.ParentID != nil {
		var parent Folder
		if err := tx.Where("id = ?", *f.ParentID).First(&parent).Error; err != nil {
			return err
		}
		f.Path = parent.Path + "/" + f.Name
	} else {
		f.Path = "/" + f.Name
	}

	return nil
}

// BeforeUpdate hook to update path if name changed
func (f *Folder) BeforeUpdate(tx *gorm.DB) error {
	if f.ParentID != nil {
		var parent Folder
		if err := tx.Where("id = ?", *f.ParentID).First(&parent).Error; err != nil {
			return err
		}
		f.Path = parent.Path + "/" + f.Name
	} else {
		f.Path = "/" + f.Name
	}
	return nil
}

type FolderResponse struct {
	ID             uuid.UUID    `json:"id"`
	Name           string       `json:"name"`
	Path           string       `json:"path"`
	ParentID       *uuid.UUID   `json:"parent_id"`
	IsShared       bool         `json:"is_shared"`
	IsTrashed      bool         `json:"is_trashed"`
	TrashedAt      *time.Time   `json:"trashed_at,omitempty"`
	Color          string       `json:"color"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
	User           UserResponse `json:"user,omitempty"`
	FileCount      int64        `json:"file_count"`
	SubfolderCount int64        `json:"subfolder_count"`
}

type FolderCreateRequest struct {
	Name     string     `json:"name" validate:"required,max=255"`
	ParentID *uuid.UUID `json:"parent_id"`
	Color    string     `json:"color" validate:"omitempty,len=7"` // hex color
}

type FolderUpdateRequest struct {
	Name  string `json:"name" validate:"required,max=255"`
	Color string `json:"color" validate:"omitempty,len=7"`
}

type FolderMoveRequest struct {
	ParentID *uuid.UUID `json:"parent_id"`
}

// ToResponse converts Folder to FolderResponse
func (f *Folder) ToResponse() FolderResponse {
	response := FolderResponse{
		ID:        f.ID,
		Name:      f.Name,
		Path:      f.Path,
		ParentID:  f.ParentID,
		IsShared:  f.IsShared,
		IsTrashed: f.IsTrashed,
		TrashedAt: f.TrashedAt,
		Color:     f.Color,
		CreatedAt: f.CreatedAt,
		UpdatedAt: f.UpdatedAt,
	}

	if f.User.ID != uuid.Nil {
		response.User = f.User.ToResponse()
	}

	return response
}

// IsRoot returns true if this is a root folder
func (f *Folder) IsRoot() bool {
	return f.ParentID == nil
}

// GetDepth returns the depth of the folder in the hierarchy
func (f *Folder) GetDepth() int {
	depth := 0
	path := f.Path
	for i := 0; i < len(path); i++ {
		if path[i] == '/' {
			depth++
		}
	}
	return depth - 1 // subtract 1 because root starts with /
}

// GetBreadcrumbs returns the folder hierarchy as breadcrumbs
type Breadcrumb struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
	Path string    `json:"path"`
}

func (f *Folder) GetBreadcrumbs(db *gorm.DB) ([]Breadcrumb, error) {
	var breadcrumbs []Breadcrumb
	current := f

	for current != nil {
		breadcrumbs = append([]Breadcrumb{{
			ID:   current.ID,
			Name: current.Name,
			Path: current.Path,
		}}, breadcrumbs...)

		if current.ParentID == nil {
			break
		}

		var parent Folder
		if err := db.Where("id = ?", *current.ParentID).First(&parent).Error; err != nil {
			return nil, err
		}
		current = &parent
	}

	return breadcrumbs, nil
}

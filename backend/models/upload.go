package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Upload struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
	UserID       uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	FileID       uuid.UUID `json:"file_id" gorm:"type:uuid;not null;index"`
	IPAddress    string    `json:"ip_address" gorm:"size:45"`
	UserAgent    string    `json:"user_agent" gorm:"size:500"`
	Status       string    `json:"status" gorm:"size:20;not null" validate:"required,oneof=pending processing completed failed"`
	ErrorMessage string    `json:"error_message" gorm:"size:500"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	// Relationships
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
	File File `json:"file,omitempty" gorm:"foreignKey:FileID"`
}

type UploadResponse struct {
	ID           uuid.UUID    `json:"id"`
	IPAddress    string       `json:"ip_address"`
	Status       string       `json:"status"`
	ErrorMessage string       `json:"error_message,omitempty"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
	User         UserResponse `json:"user,omitempty"`
	File         FileResponse `json:"file,omitempty"`
}

// BeforeCreate hook to set UUID
func (u *Upload) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// ToResponse converts Upload to UploadResponse
func (u *Upload) ToResponse() UploadResponse {
	response := UploadResponse{
		ID:           u.ID,
		IPAddress:    u.IPAddress,
		Status:       u.Status,
		ErrorMessage: u.ErrorMessage,
		CreatedAt:    u.CreatedAt,
		UpdatedAt:    u.UpdatedAt,
	}

	if u.User.ID != uuid.Nil {
		response.User = u.User.ToResponse()
	}

	if u.File.ID != uuid.Nil {
		response.File = u.File.ToResponse()
	}

	return response
}

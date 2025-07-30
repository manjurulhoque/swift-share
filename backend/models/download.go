package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Download struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primary_key"`
	UserID      *uuid.UUID `json:"user_id" gorm:"type:uuid;index"` // Nullable for anonymous downloads
	FileID      uuid.UUID  `json:"file_id" gorm:"type:uuid;not null;index"`
	ShareLinkID *uuid.UUID `json:"share_link_id" gorm:"type:uuid;index"` // Nullable for direct downloads
	IPAddress   string     `json:"ip_address" gorm:"size:45"`
	UserAgent   string     `json:"user_agent" gorm:"size:500"`
	Referrer    string     `json:"referrer" gorm:"size:500"`
	Country     string     `json:"country" gorm:"size:2"`
	City        string     `json:"city" gorm:"size:100"`
	CreatedAt   time.Time  `json:"created_at"`

	// Relationships
	User      *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	File      File       `json:"file,omitempty" gorm:"foreignKey:FileID"`
	ShareLink *ShareLink `json:"share_link,omitempty" gorm:"foreignKey:ShareLinkID"`
}

type DownloadResponse struct {
	ID        uuid.UUID          `json:"id"`
	IPAddress string             `json:"ip_address"`
	UserAgent string             `json:"user_agent"`
	Referrer  string             `json:"referrer"`
	Country   string             `json:"country"`
	City      string             `json:"city"`
	CreatedAt time.Time          `json:"created_at"`
	User      *UserResponse      `json:"user,omitempty"`
	File      FileResponse       `json:"file,omitempty"`
	ShareLink *ShareLinkResponse `json:"share_link,omitempty"`
}

type DownloadStats struct {
	TotalDownloads int                  `json:"total_downloads"`
	UniqueUsers    int                  `json:"unique_users"`
	Countries      map[string]int       `json:"countries"`
	Daily          []DailyDownloadStats `json:"daily"`
}

type DailyDownloadStats struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

// BeforeCreate hook to set UUID
func (d *Download) BeforeCreate(tx *gorm.DB) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	return nil
}

// ToResponse converts Download to DownloadResponse
func (d *Download) ToResponse() DownloadResponse {
	response := DownloadResponse{
		ID:        d.ID,
		IPAddress: d.IPAddress,
		UserAgent: d.UserAgent,
		Referrer:  d.Referrer,
		Country:   d.Country,
		City:      d.City,
		CreatedAt: d.CreatedAt,
	}

	if d.User != nil && d.User.ID != uuid.Nil {
		userResponse := d.User.ToResponse()
		response.User = &userResponse
	}

	if d.File.ID != uuid.Nil {
		response.File = d.File.ToResponse()
	}

	if d.ShareLink != nil && d.ShareLink.ID != uuid.Nil {
		shareLinkResponse := d.ShareLink.ToResponse()
		response.ShareLink = &shareLinkResponse
	}

	return response
}

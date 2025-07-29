package models

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID            uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	FirstName     string         `json:"first_name" gorm:"size:50;not null" validate:"required,min=2,max=50"`
	LastName      string         `json:"last_name" gorm:"size:50;not null" validate:"required,min=2,max=50"`
	Email         string         `json:"email" gorm:"uniqueIndex;size:255;not null" validate:"required,email"`
	Password      string         `json:"-" gorm:"size:255;not null" validate:"required,min=6"`
	IsActive      bool           `json:"is_active" gorm:"default:true"`
	IsAdmin       bool           `json:"is_admin" gorm:"default:false"`
	EmailVerified bool           `json:"email_verified" gorm:"default:false"`
	LastLoginAt   *time.Time     `json:"last_login_at"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Files      []File      `json:"files,omitempty" gorm:"foreignKey:UserID"`
	ShareLinks []ShareLink `json:"share_links,omitempty" gorm:"foreignKey:UserID"`
	Uploads    []Upload    `json:"uploads,omitempty" gorm:"foreignKey:UserID"`
	Downloads  []Download  `json:"downloads,omitempty" gorm:"foreignKey:UserID"`
	AuditLogs  []AuditLog  `json:"audit_logs,omitempty" gorm:"foreignKey:UserID"`
}

type UserRegisterRequest struct {
	FirstName string `json:"first_name" validate:"required,min=2,max=50"`
	LastName  string `json:"last_name" validate:"required,min=2,max=50"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=6"`
}

type UserLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UserResponse struct {
	ID            uuid.UUID  `json:"id"`
	FirstName     string     `json:"first_name"`
	LastName      string     `json:"last_name"`
	Email         string     `json:"email"`
	IsActive      bool       `json:"is_active"`
	IsAdmin       bool       `json:"is_admin"`
	EmailVerified bool       `json:"email_verified"`
	LastLoginAt   *time.Time `json:"last_login_at"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

type UserUpdateRequest struct {
	FirstName string `json:"first_name" validate:"omitempty,min=2,max=50"`
	LastName  string `json:"last_name" validate:"omitempty,min=2,max=50"`
	Email     string `json:"email" validate:"omitempty,email"`
}

// BeforeCreate hook to hash password and set UUID
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}

	if u.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		u.Password = string(hashedPassword)
	}

	return nil
}

// CheckPassword verifies the password
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:            u.ID,
		FirstName:     u.FirstName,
		LastName:      u.LastName,
		Email:         u.Email,
		IsActive:      u.IsActive,
		IsAdmin:       u.IsAdmin,
		EmailVerified: u.EmailVerified,
		LastLoginAt:   u.LastLoginAt,
		CreatedAt:     u.CreatedAt,
		UpdatedAt:     u.UpdatedAt,
	}
}

// GetFullName returns the user's full name
func (u *User) GetFullName() string {
	return u.FirstName + " " + u.LastName
}

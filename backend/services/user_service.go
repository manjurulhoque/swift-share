package services

import (
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService() *UserService {
	return &UserService{
		db: database.GetDB(),
	}
}

// EmailExists checks if an email already exists in the database
func (us *UserService) EmailExists(email string) bool {
	var count int64
	us.db.Model(&models.User{}).Where("email = ?", email).Count(&count)
	return count > 0
}

// GetUserByID retrieves a user by ID
func (us *UserService) GetUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := us.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail retrieves a user by email
func (us *UserService) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := us.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateUser creates a new user
func (us *UserService) CreateUser(user *models.User) error {
	return us.db.Create(user).Error
}

// UpdateUser updates an existing user
func (us *UserService) UpdateUser(user *models.User) error {
	return us.db.Save(user).Error
}

// DeleteUser soft deletes a user
func (us *UserService) DeleteUser(id uuid.UUID) error {
	return us.db.Delete(&models.User{}, id).Error
}

// DeactivateUser deactivates a user account
func (us *UserService) DeactivateUser(id uuid.UUID) error {
	return us.db.Model(&models.User{}).Where("id = ?", id).Update("is_active", false).Error
}

// ActivateUser activates a user account
func (us *UserService) ActivateUser(id uuid.UUID) error {
	return us.db.Model(&models.User{}).Where("id = ?", id).Update("is_active", true).Error
}

// GetAllUsers retrieves all users with pagination
func (us *UserService) GetAllUsers(page, perPage int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	// Count total records
	us.db.Model(&models.User{}).Count(&total)

	// Calculate offset
	offset := (page - 1) * perPage

	// Get users with pagination
	err := us.db.Offset(offset).Limit(perPage).Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// SearchUsers searches users by name or email
func (us *UserService) SearchUsers(query string, page, perPage int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	searchQuery := "%" + query + "%"

	// Count total matching records
	us.db.Model(&models.User{}).Where(
		"first_name ILIKE ? OR last_name ILIKE ? OR email ILIKE ?",
		searchQuery, searchQuery, searchQuery,
	).Count(&total)

	// Calculate offset
	offset := (page - 1) * perPage

	// Get matching users with pagination
	err := us.db.Where(
		"first_name ILIKE ? OR last_name ILIKE ? OR email ILIKE ?",
		searchQuery, searchQuery, searchQuery,
	).Offset(offset).Limit(perPage).Find(&users).Error

	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// GetUserStats returns user statistics
func (us *UserService) GetUserStats() (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Total users
	var totalUsers int64
	us.db.Model(&models.User{}).Count(&totalUsers)
	stats["total_users"] = totalUsers

	// Active users
	var activeUsers int64
	us.db.Model(&models.User{}).Where("is_active = ?", true).Count(&activeUsers)
	stats["active_users"] = activeUsers

	// Admin users
	var adminUsers int64
	us.db.Model(&models.User{}).Where("is_admin = ?", true).Count(&adminUsers)
	stats["admin_users"] = adminUsers

	// Users registered today
	var todayUsers int64
	us.db.Model(&models.User{}).Where("DATE(created_at) = CURRENT_DATE").Count(&todayUsers)
	stats["today_registrations"] = todayUsers

	return stats, nil
}

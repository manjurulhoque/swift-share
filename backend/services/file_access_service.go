package services

import (
	"time"

	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"gorm.io/gorm"
)

type FileAccessService struct {
	db *gorm.DB
}

func NewFileAccessService() *FileAccessService {
	return &FileAccessService{
		db: database.GetDB(),
	}
}

// LogFileAccess records a file access event
func (fas *FileAccessService) LogFileAccess(userID, fileID uuid.UUID, action string) error {
	access := models.FileAccess{
		UserID: userID,
		FileID: fileID,
		Action: action,
	}

	return fas.db.Create(&access).Error
}

// GetRecentFiles returns recently accessed files for a user
func (fas *FileAccessService) GetRecentFiles(userID uuid.UUID, limit int) ([]models.FileAccess, error) {
	var accesses []models.FileAccess

	// Get unique files by grouping by file_id and taking the latest access
	subquery := fas.db.Model(&models.FileAccess{}).
		Select("file_id, MAX(created_at) as latest_access").
		Where("user_id = ?", userID).
		Group("file_id")

	err := fas.db.Preload("File").Preload("File.User").
		Where("user_id = ? AND (file_id, created_at) IN (?)", userID, subquery).
		Order("created_at DESC").
		Limit(limit).
		Find(&accesses).Error

	return accesses, err
}

// GetFileAccessHistory returns access history for a specific file
func (fas *FileAccessService) GetFileAccessHistory(fileID uuid.UUID, limit int) ([]models.FileAccess, error) {
	var accesses []models.FileAccess

	err := fas.db.Preload("User").
		Where("file_id = ?", fileID).
		Order("created_at DESC").
		Limit(limit).
		Find(&accesses).Error

	return accesses, err
}

// GetUserFileAccessStats returns access statistics for a user
func (fas *FileAccessService) GetUserFileAccessStats(userID uuid.UUID, days int) (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Total accesses in the last N days
	var totalAccesses int64
	since := time.Now().AddDate(0, 0, -days)

	err := fas.db.Model(&models.FileAccess{}).
		Where("user_id = ? AND created_at >= ?", userID, since).
		Count(&totalAccesses).Error
	if err != nil {
		return nil, err
	}

	// Access by action type
	var actionCounts []struct {
		Action string
		Count  int64
	}

	err = fas.db.Model(&models.FileAccess{}).
		Select("action, COUNT(*) as count").
		Where("user_id = ? AND created_at >= ?", userID, since).
		Group("action").
		Find(&actionCounts).Error
	if err != nil {
		return nil, err
	}

	// Daily access pattern
	var dailyAccesses []struct {
		Date  time.Time
		Count int64
	}

	err = fas.db.Model(&models.FileAccess{}).
		Select("DATE(created_at) as date, COUNT(*) as count").
		Where("user_id = ? AND created_at >= ?", userID, since).
		Group("DATE(created_at)").
		Order("date ASC").
		Find(&dailyAccesses).Error
	if err != nil {
		return nil, err
	}

	stats["total_accesses"] = totalAccesses
	stats["action_counts"] = actionCounts
	stats["daily_accesses"] = dailyAccesses
	stats["days"] = days

	return stats, nil
}

// CleanupOldAccesses removes old access logs to keep the database clean
func (fas *FileAccessService) CleanupOldAccesses(olderThanDays int) error {
	cutoff := time.Now().AddDate(0, 0, -olderThanDays)

	return fas.db.Where("created_at < ?", cutoff).Delete(&models.FileAccess{}).Error
}

package services

import (
	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"gorm.io/gorm"
)

type AuditService struct {
	db *gorm.DB
}

func NewAuditService() *AuditService {
	return &AuditService{
		db: database.GetDB(),
	}
}

// LogEvent creates a new audit log entry
func (as *AuditService) LogEvent(userID *uuid.UUID, action, resource string, resourceID *uuid.UUID, details, ipAddress, userAgent, status string) error {
	auditLog := models.AuditLog{
		UserID:     userID,
		Action:     action,
		Resource:   resource,
		ResourceID: resourceID,
		Details:    details,
		IPAddress:  ipAddress,
		UserAgent:  userAgent,
		Status:     status,
	}

	return as.db.Create(&auditLog).Error
}

// GetAuditLogs retrieves audit logs with pagination and optional filters
func (as *AuditService) GetAuditLogs(page, perPage int, userID *uuid.UUID, action, resource, status string) ([]models.AuditLog, int64, error) {
	var logs []models.AuditLog
	var total int64

	query := as.db.Model(&models.AuditLog{}).Preload("User")

	// Apply filters
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}
	if action != "" {
		query = query.Where("action = ?", action)
	}
	if resource != "" {
		query = query.Where("resource = ?", resource)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Count total records
	query.Count(&total)

	// Calculate offset
	offset := (page - 1) * perPage

	// Get logs with pagination
	err := query.Order("created_at DESC").Offset(offset).Limit(perPage).Find(&logs).Error
	if err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

// GetAuditLogsByUser retrieves audit logs for a specific user
func (as *AuditService) GetAuditLogsByUser(userID uuid.UUID, page, perPage int) ([]models.AuditLog, int64, error) {
	var logs []models.AuditLog
	var total int64

	// Count total records for user
	as.db.Model(&models.AuditLog{}).Where("user_id = ?", userID).Count(&total)

	// Calculate offset
	offset := (page - 1) * perPage

	// Get user's logs with pagination
	err := as.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Offset(offset).
		Limit(perPage).
		Find(&logs).Error

	if err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

// GetAuditStats returns audit statistics
func (as *AuditService) GetAuditStats() (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Total logs
	var totalLogs int64
	as.db.Model(&models.AuditLog{}).Count(&totalLogs)
	stats["total_logs"] = totalLogs

	// Success vs failure ratio
	var successCount, failureCount int64
	as.db.Model(&models.AuditLog{}).Where("status = ?", models.StatusSuccess).Count(&successCount)
	as.db.Model(&models.AuditLog{}).Where("status = ?", models.StatusFailure).Count(&failureCount)
	stats["success_count"] = successCount
	stats["failure_count"] = failureCount

	// Top actions
	var actionStats []struct {
		Action string `json:"action"`
		Count  int64  `json:"count"`
	}
	as.db.Model(&models.AuditLog{}).
		Select("action, COUNT(*) as count").
		Group("action").
		Order("count DESC").
		Limit(10).
		Scan(&actionStats)
	stats["top_actions"] = actionStats

	// Logs today
	var todayLogs int64
	as.db.Model(&models.AuditLog{}).Where("DATE(created_at) = CURRENT_DATE").Count(&todayLogs)
	stats["today_logs"] = todayLogs

	return stats, nil
}

// CleanupOldLogs removes audit logs older than specified days
func (as *AuditService) CleanupOldLogs(daysToKeep int) (int64, error) {
	result := as.db.Where("created_at < NOW() - INTERVAL ? DAY", daysToKeep).Delete(&models.AuditLog{})
	return result.RowsAffected, result.Error
}

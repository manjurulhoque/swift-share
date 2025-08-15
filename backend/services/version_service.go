package services

import (
	"crypto/sha256"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"gorm.io/gorm"
)

type VersionService struct {
	db *gorm.DB
}

func NewVersionService() *VersionService {
	return &VersionService{
		db: database.GetDB(),
	}
}

// CreateVersion creates a new version of a file
func (vs *VersionService) CreateVersion(userID, fileID uuid.UUID, filePath string, req models.FileVersionCreateRequest) (*models.FileVersion, error) {
	// Get the original file
	var file models.File
	if err := vs.db.Where("id = ? AND user_id = ?", fileID, userID).First(&file).Error; err != nil {
		return nil, errors.New("file not found or access denied")
	}

	// Calculate checksum
	checksum, err := vs.calculateFileChecksum(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate checksum: %w", err)
	}

	// Check if a version with this checksum already exists
	var existingVersion models.FileVersion
	if err := vs.db.Where("file_id = ? AND checksum = ?", fileID, checksum).First(&existingVersion).Error; err == nil {
		return &existingVersion, nil // Return existing version if content is identical
	}

	// Get file info
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to get file info: %w", err)
	}

	// Get next version number
	var lastVersion models.FileVersion
	vs.db.Where("file_id = ?", fileID).Order("version_number DESC").First(&lastVersion)
	nextVersionNumber := lastVersion.VersionNumber + 1

	// Create new version
	version := &models.FileVersion{
		FileID:        fileID,
		UserID:        userID,
		VersionNumber: nextVersionNumber,
		FileName:      file.FileName,
		FilePath:      filePath,
		FileSize:      fileInfo.Size(),
		MimeType:      file.MimeType,
		Checksum:      checksum,
		Comment:       req.Comment,
		IsAutoSave:    req.IsAutoSave,
	}

	if err := vs.db.Create(version).Error; err != nil {
		return nil, fmt.Errorf("failed to create version: %w", err)
	}

	// Load relationships
	vs.db.Preload("User").Where("id = ?", version.ID).First(version)

	return version, nil
}

// GetFileVersions returns all versions of a file
func (vs *VersionService) GetFileVersions(userID, fileID uuid.UUID, page, limit int) (*models.FileVersionsResponse, error) {
	// Check file access
	var file models.File
	if err := vs.db.Preload("User").Where("id = ?", fileID).First(&file).Error; err != nil {
		return nil, errors.New("file not found")
	}

	// Check permissions (owner or collaborator)
	hasAccess := file.UserID == userID
	if !hasAccess {
		var collaborator models.Collaborator
		if err := vs.db.Where("file_id = ? AND user_id = ?", fileID, userID).First(&collaborator).Error; err == nil && !collaborator.IsExpired() {
			hasAccess = true
		}
	}

	if !hasAccess {
		return nil, errors.New("access denied")
	}

	// Get total count
	var totalVersions int64
	vs.db.Model(&models.FileVersion{}).Where("file_id = ?", fileID).Count(&totalVersions)

	// Get versions with pagination
	var versions []models.FileVersion
	offset := (page - 1) * limit

	if err := vs.db.Preload("User").
		Where("file_id = ?", fileID).
		Order("version_number DESC").
		Offset(offset).
		Limit(limit).
		Find(&versions).Error; err != nil {
		return nil, fmt.Errorf("failed to get versions: %w", err)
	}

	// Convert to responses
	var versionResponses []models.FileVersionResponse
	for _, version := range versions {
		versionResponses = append(versionResponses, version.ToResponse())
	}

	// Calculate total size of all versions
	var totalSize int64
	vs.db.Model(&models.FileVersion{}).
		Where("file_id = ?", fileID).
		Select("COALESCE(SUM(file_size), 0)").
		Scan(&totalSize)

	response := &models.FileVersionsResponse{
		Versions:     versionResponses,
		CurrentFile:  file.ToResponse(),
		TotalSize:    totalSize,
		VersionCount: int(totalVersions),
	}

	return response, nil
}

// GetVersion returns a specific version
func (vs *VersionService) GetVersion(userID, fileID, versionID uuid.UUID) (*models.FileVersion, error) {
	// Check file access first
	var file models.File
	if err := vs.db.Where("id = ?", fileID).First(&file).Error; err != nil {
		return nil, errors.New("file not found")
	}

	// Check permissions
	hasAccess := file.UserID == userID
	if !hasAccess {
		var collaborator models.Collaborator
		if err := vs.db.Where("file_id = ? AND user_id = ?", fileID, userID).First(&collaborator).Error; err == nil && !collaborator.IsExpired() {
			hasAccess = true
		}
	}

	if !hasAccess {
		return nil, errors.New("access denied")
	}

	// Get the version
	var version models.FileVersion
	if err := vs.db.Preload("User").Preload("File").
		Where("id = ? AND file_id = ?", versionID, fileID).
		First(&version).Error; err != nil {
		return nil, errors.New("version not found")
	}

	return &version, nil
}

// RestoreVersion restores a file to a specific version
func (vs *VersionService) RestoreVersion(userID, fileID, versionID uuid.UUID, req models.RestoreVersionRequest) (*models.File, error) {
	// Check file ownership (only owner can restore)
	var file models.File
	if err := vs.db.Where("id = ? AND user_id = ?", fileID, userID).First(&file).Error; err != nil {
		return nil, errors.New("file not found or access denied")
	}

	// Get the version to restore
	var version models.FileVersion
	if err := vs.db.Where("id = ? AND file_id = ?", versionID, fileID).First(&version).Error; err != nil {
		return nil, errors.New("version not found")
	}

	// Check if version file exists
	if _, err := os.Stat(version.FilePath); os.IsNotExist(err) {
		return nil, errors.New("version file not found on disk")
	}

	// Create a backup of current file as a new version before restoring
	currentChecksum, err := vs.calculateFileChecksum(file.FilePath)
	if err == nil && currentChecksum != version.Checksum {
		// Only create backup if content is different
		vs.CreateVersion(userID, fileID, file.FilePath, models.FileVersionCreateRequest{
			Comment:    "Backup before restore",
			IsAutoSave: true,
		})
	}

	// Copy version file to current file location
	if err := vs.copyFile(version.FilePath, file.FilePath); err != nil {
		return nil, fmt.Errorf("failed to restore file: %w", err)
	}

	// Update file metadata
	fileInfo, err := os.Stat(file.FilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to get restored file info: %w", err)
	}

	// Update file record
	updates := map[string]interface{}{
		"file_size":  fileInfo.Size(),
		"updated_at": time.Now(),
	}

	if err := vs.db.Model(&file).Updates(updates).Error; err != nil {
		return nil, fmt.Errorf("failed to update file record: %w", err)
	}

	// Create new version record for the restore
	_, err = vs.CreateVersion(userID, fileID, file.FilePath, models.FileVersionCreateRequest{
		Comment:    fmt.Sprintf("Restored from version %d: %s", version.VersionNumber, req.Comment),
		IsAutoSave: false,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create restore version: %w", err)
	}

	// Reload file with updated data
	vs.db.Preload("User").Where("id = ?", fileID).First(&file)

	return &file, nil
}

// DeleteVersion deletes a specific version (not the current file)
func (vs *VersionService) DeleteVersion(userID, fileID, versionID uuid.UUID) error {
	// Check file ownership
	var file models.File
	if err := vs.db.Where("id = ? AND user_id = ?", fileID, userID).First(&file).Error; err != nil {
		return errors.New("file not found or access denied")
	}

	// Get the version
	var version models.FileVersion
	if err := vs.db.Where("id = ? AND file_id = ?", versionID, fileID).First(&version).Error; err != nil {
		return errors.New("version not found")
	}

	// Don't allow deletion of the latest version
	var latestVersion models.FileVersion
	vs.db.Where("file_id = ?", fileID).Order("version_number DESC").First(&latestVersion)
	if version.ID == latestVersion.ID {
		return errors.New("cannot delete the latest version")
	}

	// Delete version file from disk
	if err := os.Remove(version.FilePath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete version file: %w", err)
	}

	// Delete version record
	if err := vs.db.Delete(&version).Error; err != nil {
		return fmt.Errorf("failed to delete version record: %w", err)
	}

	return nil
}

// CleanupOldVersions removes old versions beyond the specified limit
func (vs *VersionService) CleanupOldVersions(fileID uuid.UUID, keepVersions int) error {
	if keepVersions <= 0 {
		return errors.New("must keep at least 1 version")
	}

	// Get versions to delete (older than the keep limit)
	var versionsToDelete []models.FileVersion
	if err := vs.db.Where("file_id = ?", fileID).
		Order("version_number DESC").
		Offset(keepVersions).
		Find(&versionsToDelete).Error; err != nil {
		return err
	}

	// Delete each version
	for _, version := range versionsToDelete {
		// Delete file from disk
		if err := os.Remove(version.FilePath); err != nil && !os.IsNotExist(err) {
			continue // Continue even if file deletion fails
		}

		// Delete record
		vs.db.Delete(&version)
	}

	return nil
}

// GetVersionStats returns version statistics for a file
func (vs *VersionService) GetVersionStats(userID, fileID uuid.UUID) (map[string]interface{}, error) {
	// Check access
	var file models.File
	if err := vs.db.Where("id = ?", fileID).First(&file).Error; err != nil {
		return nil, errors.New("file not found")
	}

	hasAccess := file.UserID == userID
	if !hasAccess {
		var collaborator models.Collaborator
		if err := vs.db.Where("file_id = ? AND user_id = ?", fileID, userID).First(&collaborator).Error; err == nil && !collaborator.IsExpired() {
			hasAccess = true
		}
	}

	if !hasAccess {
		return nil, errors.New("access denied")
	}

	stats := make(map[string]interface{})

	// Total versions
	var totalVersions int64
	vs.db.Model(&models.FileVersion{}).Where("file_id = ?", fileID).Count(&totalVersions)

	// Total size
	var totalSize int64
	vs.db.Model(&models.FileVersion{}).
		Where("file_id = ?", fileID).
		Select("COALESCE(SUM(file_size), 0)").
		Scan(&totalSize)

	// Auto-save vs manual saves
	var autoSaves, manualSaves int64
	vs.db.Model(&models.FileVersion{}).Where("file_id = ? AND is_auto_save = true", fileID).Count(&autoSaves)
	vs.db.Model(&models.FileVersion{}).Where("file_id = ? AND is_auto_save = false", fileID).Count(&manualSaves)

	// Latest version
	var latestVersion models.FileVersion
	vs.db.Where("file_id = ?", fileID).Order("version_number DESC").First(&latestVersion)

	stats["total_versions"] = totalVersions
	stats["total_size"] = totalSize
	stats["auto_saves"] = autoSaves
	stats["manual_saves"] = manualSaves
	stats["latest_version"] = latestVersion.VersionNumber
	stats["oldest_version"] = time.Now() // Will be calculated properly

	return stats, nil
}

// Helper functions

func (vs *VersionService) calculateFileChecksum(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", hash.Sum(nil)), nil
}

func (vs *VersionService) copyFile(src, dst string) error {
	// Ensure destination directory exists
	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}

	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	dstFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	_, err = io.Copy(dstFile, srcFile)
	return err
}

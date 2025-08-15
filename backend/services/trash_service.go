package services

import (
	"time"

	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"gorm.io/gorm"
)

type TrashService struct {
	db *gorm.DB
}

func NewTrashService() *TrashService {
	return &TrashService{
		db: database.GetDB(),
	}
}

// MoveFileToTrash moves a file to trash (soft delete)
func (ts *TrashService) MoveFileToTrash(userID, fileID uuid.UUID) error {
	now := time.Now()
	return ts.db.Model(&models.File{}).
		Where("id = ? AND user_id = ? AND is_trashed = false", fileID, userID).
		Updates(map[string]interface{}{
			"is_trashed": true,
			"trashed_at": now,
			"updated_at": now,
		}).Error
}

// MoveFolderToTrash moves a folder and all its contents to trash
func (ts *TrashService) MoveFolderToTrash(userID, folderID uuid.UUID) error {
	return ts.db.Transaction(func(tx *gorm.DB) error {
		now := time.Now()

		// Get the folder to check ownership
		var folder models.Folder
		if err := tx.Where("id = ? AND user_id = ?", folderID, userID).First(&folder).Error; err != nil {
			return err
		}

		// Move folder to trash
		if err := tx.Model(&folder).Updates(map[string]interface{}{
			"is_trashed": true,
			"trashed_at": now,
			"updated_at": now,
		}).Error; err != nil {
			return err
		}

		// Move all files in the folder to trash
		if err := tx.Model(&models.File{}).
			Where("folder_id = ? AND user_id = ? AND is_trashed = false", folderID, userID).
			Updates(map[string]interface{}{
				"is_trashed": true,
				"trashed_at": now,
				"updated_at": now,
			}).Error; err != nil {
			return err
		}

		// Recursively move subfolders to trash
		var subfolders []models.Folder
		if err := tx.Where("parent_id = ? AND user_id = ? AND is_trashed = false", folderID, userID).Find(&subfolders).Error; err != nil {
			return err
		}

		for _, subfolder := range subfolders {
			if err := ts.moveFolderToTrashRecursive(tx, userID, subfolder.ID, now); err != nil {
				return err
			}
		}

		return nil
	})
}

// Helper function for recursive folder trash operations
func (ts *TrashService) moveFolderToTrashRecursive(tx *gorm.DB, userID, folderID uuid.UUID, trashedAt time.Time) error {
	// Move current folder to trash
	if err := tx.Model(&models.Folder{}).
		Where("id = ? AND user_id = ?", folderID, userID).
		Updates(map[string]interface{}{
			"is_trashed": true,
			"trashed_at": trashedAt,
			"updated_at": trashedAt,
		}).Error; err != nil {
		return err
	}

	// Move all files in this folder to trash
	if err := tx.Model(&models.File{}).
		Where("folder_id = ? AND user_id = ? AND is_trashed = false", folderID, userID).
		Updates(map[string]interface{}{
			"is_trashed": true,
			"trashed_at": trashedAt,
			"updated_at": trashedAt,
		}).Error; err != nil {
		return err
	}

	// Get subfolders and recursively move them to trash
	var subfolders []models.Folder
	if err := tx.Where("parent_id = ? AND user_id = ? AND is_trashed = false", folderID, userID).Find(&subfolders).Error; err != nil {
		return err
	}

	for _, subfolder := range subfolders {
		if err := ts.moveFolderToTrashRecursive(tx, userID, subfolder.ID, trashedAt); err != nil {
			return err
		}
	}

	return nil
}

// RestoreFileFromTrash restores a file from trash
func (ts *TrashService) RestoreFileFromTrash(userID, fileID uuid.UUID) error {
	return ts.db.Model(&models.File{}).
		Where("id = ? AND user_id = ? AND is_trashed = true", fileID, userID).
		Updates(map[string]interface{}{
			"is_trashed": false,
			"trashed_at": nil,
			"updated_at": time.Now(),
		}).Error
}

// RestoreFolderFromTrash restores a folder and all its contents from trash
func (ts *TrashService) RestoreFolderFromTrash(userID, folderID uuid.UUID) error {
	return ts.db.Transaction(func(tx *gorm.DB) error {
		now := time.Now()

		// Get the folder to check ownership
		var folder models.Folder
		if err := tx.Where("id = ? AND user_id = ? AND is_trashed = true", folderID, userID).First(&folder).Error; err != nil {
			return err
		}

		// Restore folder
		if err := tx.Model(&folder).Updates(map[string]interface{}{
			"is_trashed": false,
			"trashed_at": nil,
			"updated_at": now,
		}).Error; err != nil {
			return err
		}

		// Restore all files in the folder
		if err := tx.Model(&models.File{}).
			Where("folder_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).
			Updates(map[string]interface{}{
				"is_trashed": false,
				"trashed_at": nil,
				"updated_at": now,
			}).Error; err != nil {
			return err
		}

		// Recursively restore subfolders
		var subfolders []models.Folder
		if err := tx.Where("parent_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).Find(&subfolders).Error; err != nil {
			return err
		}

		for _, subfolder := range subfolders {
			if err := ts.restoreFolderFromTrashRecursive(tx, userID, subfolder.ID, now); err != nil {
				return err
			}
		}

		return nil
	})
}

// Helper function for recursive folder restore operations
func (ts *TrashService) restoreFolderFromTrashRecursive(tx *gorm.DB, userID, folderID uuid.UUID, restoredAt time.Time) error {
	// Restore current folder
	if err := tx.Model(&models.Folder{}).
		Where("id = ? AND user_id = ? AND is_trashed = true", folderID, userID).
		Updates(map[string]interface{}{
			"is_trashed": false,
			"trashed_at": nil,
			"updated_at": restoredAt,
		}).Error; err != nil {
		return err
	}

	// Restore all files in this folder
	if err := tx.Model(&models.File{}).
		Where("folder_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).
		Updates(map[string]interface{}{
			"is_trashed": false,
			"trashed_at": nil,
			"updated_at": restoredAt,
		}).Error; err != nil {
		return err
	}

	// Get subfolders and recursively restore them
	var subfolders []models.Folder
	if err := tx.Where("parent_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).Find(&subfolders).Error; err != nil {
		return err
	}

	for _, subfolder := range subfolders {
		if err := ts.restoreFolderFromTrashRecursive(tx, userID, subfolder.ID, restoredAt); err != nil {
			return err
		}
	}

	return nil
}

// GetTrashedItems returns all trashed files and folders for a user
func (ts *TrashService) GetTrashedItems(userID uuid.UUID, page, limit int) (map[string]interface{}, error) {
	offset := (page - 1) * limit

	// Get trashed files
	var files []models.File
	var totalFiles int64

	if err := ts.db.Model(&models.File{}).
		Where("user_id = ? AND is_trashed = true", userID).
		Count(&totalFiles).Error; err != nil {
		return nil, err
	}

	if err := ts.db.Preload("User").Preload("Folder").
		Where("user_id = ? AND is_trashed = true", userID).
		Order("trashed_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&files).Error; err != nil {
		return nil, err
	}

	// Get trashed folders
	var folders []models.Folder
	var totalFolders int64

	if err := ts.db.Model(&models.Folder{}).
		Where("user_id = ? AND is_trashed = true", userID).
		Count(&totalFolders).Error; err != nil {
		return nil, err
	}

	if err := ts.db.Preload("User").
		Where("user_id = ? AND is_trashed = true", userID).
		Order("trashed_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&folders).Error; err != nil {
		return nil, err
	}

	// Convert to responses
	var fileResponses []models.FileResponse
	for _, file := range files {
		fileResponses = append(fileResponses, file.ToResponse())
	}

	var folderResponses []models.FolderResponse
	for _, folder := range folders {
		folderResponses = append(folderResponses, folder.ToResponse())
	}

	totalPages := int((totalFiles + totalFolders + int64(limit) - 1) / int64(limit))

	return map[string]interface{}{
		"files":         fileResponses,
		"folders":       folderResponses,
		"total_files":   totalFiles,
		"total_folders": totalFolders,
		"total_items":   totalFiles + totalFolders,
		"current_page":  page,
		"total_pages":   totalPages,
		"page_size":     limit,
	}, nil
}

// PermanentlyDeleteFile permanently deletes a file from trash
func (ts *TrashService) PermanentlyDeleteFile(userID, fileID uuid.UUID) error {
	return ts.db.Unscoped().
		Where("id = ? AND user_id = ? AND is_trashed = true", fileID, userID).
		Delete(&models.File{}).Error
}

// PermanentlyDeleteFolder permanently deletes a folder and all its contents
func (ts *TrashService) PermanentlyDeleteFolder(userID, folderID uuid.UUID) error {
	return ts.db.Transaction(func(tx *gorm.DB) error {
		// Get the folder to check ownership
		var folder models.Folder
		if err := tx.Unscoped().Where("id = ? AND user_id = ? AND is_trashed = true", folderID, userID).First(&folder).Error; err != nil {
			return err
		}

		// Permanently delete all files in the folder
		if err := tx.Unscoped().
			Where("folder_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).
			Delete(&models.File{}).Error; err != nil {
			return err
		}

		// Recursively delete subfolders
		var subfolders []models.Folder
		if err := tx.Unscoped().Where("parent_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).Find(&subfolders).Error; err != nil {
			return err
		}

		for _, subfolder := range subfolders {
			if err := ts.permanentlyDeleteFolderRecursive(tx, userID, subfolder.ID); err != nil {
				return err
			}
		}

		// Finally delete the folder itself
		return tx.Unscoped().Where("id = ? AND user_id = ?", folderID, userID).Delete(&models.Folder{}).Error
	})
}

// Helper function for recursive permanent folder deletion
func (ts *TrashService) permanentlyDeleteFolderRecursive(tx *gorm.DB, userID, folderID uuid.UUID) error {
	// Permanently delete all files in this folder
	if err := tx.Unscoped().
		Where("folder_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).
		Delete(&models.File{}).Error; err != nil {
		return err
	}

	// Get subfolders and recursively delete them
	var subfolders []models.Folder
	if err := tx.Unscoped().Where("parent_id = ? AND user_id = ? AND is_trashed = true", folderID, userID).Find(&subfolders).Error; err != nil {
		return err
	}

	for _, subfolder := range subfolders {
		if err := ts.permanentlyDeleteFolderRecursive(tx, userID, subfolder.ID); err != nil {
			return err
		}
	}

	// Delete the folder itself
	return tx.Unscoped().Where("id = ? AND user_id = ?", folderID, userID).Delete(&models.Folder{}).Error
}

// EmptyTrash permanently deletes all items in trash for a user
func (ts *TrashService) EmptyTrash(userID uuid.UUID) error {
	return ts.db.Transaction(func(tx *gorm.DB) error {
		// Permanently delete all trashed files
		if err := tx.Unscoped().
			Where("user_id = ? AND is_trashed = true", userID).
			Delete(&models.File{}).Error; err != nil {
			return err
		}

		// Permanently delete all trashed folders
		return tx.Unscoped().
			Where("user_id = ? AND is_trashed = true", userID).
			Delete(&models.Folder{}).Error
	})
}

// CleanupOldTrashedItems automatically deletes items that have been in trash for too long
func (ts *TrashService) CleanupOldTrashedItems(olderThanDays int) error {
	cutoff := time.Now().AddDate(0, 0, -olderThanDays)

	return ts.db.Transaction(func(tx *gorm.DB) error {
		// Permanently delete old trashed files
		if err := tx.Unscoped().
			Where("is_trashed = true AND trashed_at < ?", cutoff).
			Delete(&models.File{}).Error; err != nil {
			return err
		}

		// Permanently delete old trashed folders
		return tx.Unscoped().
			Where("is_trashed = true AND trashed_at < ?", cutoff).
			Delete(&models.Folder{}).Error
	})
}

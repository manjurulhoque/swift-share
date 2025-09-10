package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/database"
	"github.com/manjurulhoque/swift-share/backend/models"
	"gorm.io/gorm"
)

type CollaboratorService struct {
	db *gorm.DB
}

func NewCollaboratorService() *CollaboratorService {
	return &CollaboratorService{
		db: database.GetDB(),
	}
}

// AddCollaborator adds a collaborator to a file or folder
func (cs *CollaboratorService) AddCollaborator(ownerID, resourceID uuid.UUID, req models.AddCollaboratorRequest, isFile bool) (*models.Collaborator, error) {
	// Verify ownership
	if isFile {
		var file models.File
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&file).Error; err != nil {
			return nil, errors.New("file not found or access denied")
		}
	} else {
		var folder models.Folder
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&folder).Error; err != nil {
			return nil, errors.New("folder not found or access denied")
		}
	}

	// Check if user exists
	var user models.User
	if err := cs.db.Where("id = ?", req.UserID).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}

	// Check if user is trying to add themselves
	if req.UserID == ownerID {
		return nil, errors.New("cannot add yourself as a collaborator")
	}

	// Check if collaborator already exists
	var existingCollaborator models.Collaborator
	query := cs.db.Where("user_id = ?", req.UserID)
	if isFile {
		query = query.Where("file_id = ?", resourceID)
	} else {
		query = query.Where("folder_id = ?", resourceID)
	}

	if err := query.First(&existingCollaborator).Error; err == nil {
		// Update existing collaborator
		existingCollaborator.Role = req.Role
		existingCollaborator.ExpiresAt = req.ExpiresAt
		if err := cs.db.Save(&existingCollaborator).Error; err != nil {
			return nil, err
		}
		cs.loadCollaboratorRelations(&existingCollaborator)
		return &existingCollaborator, nil
	}

	// Create new collaborator
	collaborator := &models.Collaborator{
		UserID:    req.UserID,
		Role:      req.Role,
		ExpiresAt: req.ExpiresAt,
	}

	if isFile {
		collaborator.FileID = &resourceID
	} else {
		collaborator.FolderID = &resourceID
	}

	if err := cs.db.Create(collaborator).Error; err != nil {
		return nil, err
	}

	cs.loadCollaboratorRelations(collaborator)
	return collaborator, nil
}

// GetCollaborators returns all collaborators for a file or folder
func (cs *CollaboratorService) GetCollaborators(ownerID, resourceID uuid.UUID, isFile bool) ([]models.Collaborator, error) {
	// Verify ownership
	if isFile {
		var file models.File
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&file).Error; err != nil {
			return nil, errors.New("file not found or access denied")
		}
	} else {
		var folder models.Folder
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&folder).Error; err != nil {
			return nil, errors.New("folder not found or access denied")
		}
	}

	var collaborators []models.Collaborator
	query := cs.db.Preload("User")
	if isFile {
		query = query.Where("file_id = ?", resourceID)
	} else {
		query = query.Where("folder_id = ?", resourceID)
	}

	if err := query.Find(&collaborators).Error; err != nil {
		return nil, err
	}

	return collaborators, nil
}

// UpdateCollaborator updates a collaborator's role or expiration
func (cs *CollaboratorService) UpdateCollaborator(ownerID, resourceID, collaboratorID uuid.UUID, req models.UpdateCollaboratorRequest, isFile bool) (*models.Collaborator, error) {
	// Verify ownership
	if isFile {
		var file models.File
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&file).Error; err != nil {
			return nil, errors.New("file not found or access denied")
		}
	} else {
		var folder models.Folder
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&folder).Error; err != nil {
			return nil, errors.New("folder not found or access denied")
		}
	}

	var collaborator models.Collaborator
	query := cs.db.Where("id = ? AND user_id = ?", collaboratorID, collaboratorID)
	if isFile {
		query = query.Where("file_id = ?", resourceID)
	} else {
		query = query.Where("folder_id = ?", resourceID)
	}

	if err := query.First(&collaborator).Error; err != nil {
		return nil, errors.New("collaborator not found")
	}

	// Update fields
	if req.Role != "" {
		collaborator.Role = req.Role
	}
	if req.ExpiresAt != nil {
		collaborator.ExpiresAt = req.ExpiresAt
	}

	if err := cs.db.Save(&collaborator).Error; err != nil {
		return nil, err
	}

	cs.loadCollaboratorRelations(&collaborator)
	return &collaborator, nil
}

// RemoveCollaborator removes a collaborator from a file or folder
func (cs *CollaboratorService) RemoveCollaborator(ownerID, resourceID, collaboratorID uuid.UUID, isFile bool) error {
	// Verify ownership
	if isFile {
		var file models.File
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&file).Error; err != nil {
			return errors.New("file not found or access denied")
		}
	} else {
		var folder models.Folder
		if err := cs.db.Where("id = ? AND user_id = ? AND is_trashed = false", resourceID, ownerID).First(&folder).Error; err != nil {
			return errors.New("folder not found or access denied")
		}
	}

	query := cs.db.Where("id = ? AND user_id = ?", collaboratorID, collaboratorID)
	if isFile {
		query = query.Where("file_id = ?", resourceID)
	} else {
		query = query.Where("folder_id = ?", resourceID)
	}

	if err := query.Delete(&models.Collaborator{}).Error; err != nil {
		return err
	}

	return nil
}

// CheckCollaboratorAccess checks if a user has access to a file or folder as a collaborator
func (cs *CollaboratorService) CheckCollaboratorAccess(userID, resourceID uuid.UUID, isFile bool) (*models.Collaborator, error) {
	var collaborator models.Collaborator
	query := cs.db.Where("user_id = ?", userID)
	if isFile {
		query = query.Where("file_id = ?", resourceID)
	} else {
		query = query.Where("folder_id = ?", resourceID)
	}

	if err := query.First(&collaborator).Error; err != nil {
		return nil, errors.New("access denied")
	}

	// Check if expired
	if collaborator.IsExpired() {
		return nil, errors.New("collaborator access has expired")
	}

	cs.loadCollaboratorRelations(&collaborator)
	return &collaborator, nil
}

// GetUserCollaborations returns all files/folders where the user is a collaborator
func (cs *CollaboratorService) GetUserCollaborations(userID uuid.UUID, isFile bool) ([]models.Collaborator, error) {
	var collaborators []models.Collaborator
	query := cs.db.Preload("User")
	if isFile {
		query = query.Preload("File").Where("user_id = ? AND file_id IS NOT NULL", userID)
	} else {
		query = query.Preload("Folder").Where("user_id = ? AND folder_id IS NOT NULL", userID)
	}

	if err := query.Find(&collaborators).Error; err != nil {
		return nil, err
	}

	return collaborators, nil
}

// CleanupExpiredCollaborators removes expired collaborators
func (cs *CollaboratorService) CleanupExpiredCollaborators() error {
	return cs.db.Where("expires_at < ?", time.Now()).Delete(&models.Collaborator{}).Error
}

// Helper function to load relationships
func (cs *CollaboratorService) loadCollaboratorRelations(collaborator *models.Collaborator) {
	cs.db.Preload("User").Preload("File").Preload("Folder").
		Where("id = ?", collaborator.ID).First(collaborator)
}

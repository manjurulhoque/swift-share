package storage

import (
	"context"
	"errors"
	"time"

	"github.com/manjurulhoque/swift-share/backend/config"
)

// StorageService is the abstraction for saving and deleting files regardless of the backend (local, s3, gcs, ...)
type StorageService interface {
	// UploadFile stores data from reader under given key (path/object name) and returns a public or downloadable URL
	UploadFile(ctx context.Context, key string, data []byte, contentType string) (url string, err error)
	// DeleteFile removes the object with given key
	DeleteFile(ctx context.Context, key string) error
	// GeneratePresignedURL generates a pre-signed URL for file download with expiration
	GeneratePresignedURL(ctx context.Context, key string, expiration time.Duration) (url string, err error)
	// FileExists checks if a file exists in storage
	FileExists(ctx context.Context, key string) (bool, error)
}

var defaultStorage StorageService

// InitDefaultStorage initializes the package-level default storage implementation. Call this once at startup.
func InitDefaultStorage() error {
	svc, err := NewStorageService(config.AppConfig.Storage)
	if err != nil {
		return err
	}
	defaultStorage = svc
	return nil
}

// GetStorage returns the initialized default storage service.
func GetStorage() StorageService {
	if defaultStorage == nil {
		// should never happen – programmer error
		panic("storage service not initialized, call storage.InitDefaultStorage() in main")
	}
	return defaultStorage
}

// NewStorageService is a factory returning a StorageService based on driver name in cfg.
func NewStorageService(cfg config.StorageConfig) (StorageService, error) {
	switch cfg.Driver {
	case "local":
		return NewLocalStorage(cfg.LocalPath), nil
	case "s3":
		return NewS3Storage(cfg)
	case "gcs":
		return nil, errors.New("gcs storage not implemented yet")
	default:
		return nil, errors.New("unsupported storage driver: " + cfg.Driver)
	}
}

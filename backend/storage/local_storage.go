package storage

import (
	"context"
	"io/ioutil"
	"os"
	"path/filepath"
	"time"
)

type localStorage struct {
	basePath string
}

// NewLocalStorage returns a StorageService that writes files to the local filesystem (inside basePath).
func NewLocalStorage(basePath string) StorageService {
	// ensure directory exists
	_ = os.MkdirAll(basePath, 0755)
	return &localStorage{basePath: basePath}
}

func (l *localStorage) UploadFile(ctx context.Context, key string, data []byte, _ string) (string, error) {
	fullPath := filepath.Join(l.basePath, key)
	if err := os.MkdirAll(filepath.Dir(fullPath), 0755); err != nil {
		return "", err
	}
	if err := ioutil.WriteFile(fullPath, data, 0644); err != nil {
		return "", err
	}
	// Return the absolute filesystem path so the controller can serve the file
	return fullPath, nil
}

func (l *localStorage) DeleteFile(ctx context.Context, key string) error {
	fullPath := filepath.Join(l.basePath, key)
	if err := os.Remove(fullPath); err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}

func (l *localStorage) GeneratePresignedURL(ctx context.Context, key string, expiration time.Duration) (string, error) {
	// For local storage, we return the file path
	// In a real implementation, you might want to create a temporary download endpoint
	fullPath := filepath.Join(l.basePath, key)
	return fullPath, nil
}

func (l *localStorage) FileExists(ctx context.Context, key string) (bool, error) {
	fullPath := filepath.Join(l.basePath, key)
	_, err := os.Stat(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

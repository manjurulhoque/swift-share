package storage

import (
    "context"
    "io/ioutil"
    "os"
    "path/filepath"
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

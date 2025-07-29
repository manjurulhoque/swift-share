package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/manjurulhoque/swift-share/backend/config"
)

// SaveUploadedFile saves an uploaded file to the specified directory
func SaveUploadedFile(file *multipart.FileHeader, uploadPath string) (string, error) {
	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)

	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		return "", err
	}

	// Full file path
	filePath := filepath.Join(uploadPath, filename)

	// Open uploaded file
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// Create destination file
	dst, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	// Copy file content
	if _, err := io.Copy(dst, src); err != nil {
		return "", err
	}

	return filename, nil
}

// DeleteFile deletes a file from the filesystem
func DeleteFile(filePath string) error {
	if _, err := os.Stat(filePath); err == nil {
		return os.Remove(filePath)
	}
	return nil
}

// IsAllowedFileType checks if the file type is allowed
func IsAllowedFileType(filename string) bool {
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(filename), "."))
	allowedTypes := config.AppConfig.Upload.AllowedFileTypes

	for _, allowedType := range allowedTypes {
		if ext == strings.ToLower(allowedType) {
			return true
		}
	}

	return false
}

// IsValidFileSize checks if the file size is within limits
func IsValidFileSize(size int64) bool {
	return size <= config.AppConfig.Upload.MaxFileSize
}

// GetFileExtension returns the file extension without the dot
func GetFileExtension(filename string) string {
	ext := filepath.Ext(filename)
	return strings.ToLower(strings.TrimPrefix(ext, "."))
}

// GetMimeType returns the MIME type based on file extension
func GetMimeType(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))

	mimeTypes := map[string]string{
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".png":  "image/png",
		".gif":  "image/gif",
		".pdf":  "application/pdf",
		".doc":  "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".txt":  "text/plain",
		".zip":  "application/zip",
		".rar":  "application/x-rar-compressed",
		".mp4":  "video/mp4",
		".mp3":  "audio/mpeg",
		".wav":  "audio/wav",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	}

	if mimeType, exists := mimeTypes[ext]; exists {
		return mimeType
	}

	return "application/octet-stream"
}

// FormatFileSize formats file size in human-readable format
func FormatFileSize(size int64) string {
	const unit = 1024
	if size < unit {
		return fmt.Sprintf("%d B", size)
	}

	div, exp := int64(unit), 0
	for n := size / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}

	units := []string{"KB", "MB", "GB", "TB"}
	return fmt.Sprintf("%.1f %s", float64(size)/float64(div), units[exp])
}

// GenerateFilePath generates a file path with date-based directory structure
func GenerateFilePath(baseDir string) string {
	now := time.Now()
	yearMonth := fmt.Sprintf("%d/%02d", now.Year(), now.Month())
	return filepath.Join(baseDir, yearMonth)
}

// FileExists checks if a file exists
func FileExists(filePath string) bool {
	_, err := os.Stat(filePath)
	return err == nil
}

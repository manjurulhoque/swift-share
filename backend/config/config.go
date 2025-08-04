package config

import (
	"log"
	"log/slog"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Upload   UploadConfig
	Storage  StorageConfig
	CORS     CORSConfig
	Redis    RedisConfig
	Email    EmailConfig
	Logging  LoggingConfig
}

type ServerConfig struct {
	Port    string
	Host    string
	GinMode string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	Driver   string
	SSLMode  string
}

type JWTConfig struct {
	Secret    string
	ExpiresIn string
}

type UploadConfig struct {
	MaxFileSize      int64
	UploadPath       string
	AllowedFileTypes []string
}

type StorageConfig struct {
	Driver      string // local, s3, gcs
	LocalPath   string
	S3Bucket    string
	S3Region    string
	S3AccessKey string
	S3SecretKey string
	S3Endpoint  string // optional custom endpoint
}

func (s *StorageConfig) IsS3() bool {
	return s.Driver == "s3"
}

func (s *StorageConfig) IsLocal() bool {
	return s.Driver == "local"
}

type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type EmailConfig struct {
	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	FromEmail    string
	FromName     string
}

type LoggingConfig struct {
	Level     string // debug, info, warn, error
	Format    string // json, text
	Output    string // stdout, stderr, file
	FilePath  string // path to log file (if output is file)
	AddSource bool   // whether to add source file info
}

var AppConfig *Config
var Logger *slog.Logger

func LoadConfig() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	AppConfig = &Config{
		Server: ServerConfig{
			Port:    getEnv("PORT", "8080"),
			Host:    getEnv("HOST", "localhost"),
			GinMode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Name:     getEnv("DB_NAME", "swift_share"),
			Driver:   getEnv("DB_DRIVER", "postgres"),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:    getEnv("JWT_SECRET", "your-secret-key"),
			ExpiresIn: getEnv("JWT_EXPIRES_IN", "24h"),
		},
		Upload: UploadConfig{
			MaxFileSize:      getEnvAsInt64("MAX_FILE_SIZE", 104857600), // 100MB
			UploadPath:       getEnv("UPLOAD_PATH", "./uploads"),
			AllowedFileTypes: getEnvAsSlice("ALLOWED_FILE_TYPES", []string{"jpg", "jpeg", "png", "pdf", "doc", "docx", "txt", "zip"}),
		},
		Storage: StorageConfig{
			Driver:      getEnv("STORAGE_DRIVER", "local"),
			LocalPath:   getEnv("LOCAL_UPLOAD_PATH", "./uploads"),
			S3Bucket:    getEnv("AWS_S3_BUCKET", ""),
			S3Region:    getEnv("AWS_REGION", ""),
			S3AccessKey: getEnv("AWS_ACCESS_KEY_ID", ""),
			S3SecretKey: getEnv("AWS_SECRET_ACCESS_KEY", ""),
			S3Endpoint:  getEnv("AWS_S3_ENDPOINT", ""),
		},
		CORS: CORSConfig{
			AllowedOrigins: getEnvAsSlice("ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
			AllowedMethods: getEnvAsSlice("ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
			AllowedHeaders: getEnvAsSlice("ALLOWED_HEADERS", []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
		},
		Email: EmailConfig{
			SMTPHost:     getEnv("SMTP_HOST", ""),
			SMTPPort:     getEnv("SMTP_PORT", "587"),
			SMTPUsername: getEnv("SMTP_USERNAME", ""),
			SMTPPassword: getEnv("SMTP_PASSWORD", ""),
			FromEmail:    getEnv("FROM_EMAIL", ""),
			FromName:     getEnv("FROM_NAME", "Swift Share"),
		},
		Logging: LoggingConfig{
			Level:     getEnv("LOG_LEVEL", "info"),
			Format:    getEnv("LOG_FORMAT", "json"),
			Output:    getEnv("LOG_OUTPUT", "stdout"),
			FilePath:  getEnv("LOG_FILE_PATH", "./logs/app.log"),
			AddSource: getEnv("LOG_ADD_SOURCE", "true") == "true",
		},
	}

	// Initialize logger after config is loaded
	initLogger()
}

func initLogger() {
	var level slog.Level
	switch strings.ToLower(AppConfig.Logging.Level) {
	case "debug":
		level = slog.LevelDebug
	case "info":
		level = slog.LevelInfo
	case "warn", "warning":
		level = slog.LevelWarn
	case "error":
		level = slog.LevelError
	default:
		level = slog.LevelInfo
	}

	opts := &slog.HandlerOptions{
		Level:     level,
		AddSource: AppConfig.Logging.AddSource,
	}

	var handler slog.Handler
	var output *os.File = os.Stdout

	// Determine output destination
	switch strings.ToLower(AppConfig.Logging.Output) {
	case "stderr":
		output = os.Stderr
	case "file":
		// Create logs directory if it doesn't exist
		if err := os.MkdirAll("./logs", 0755); err != nil {
			log.Printf("Failed to create logs directory: %v", err)
			output = os.Stdout
		} else {
			file, err := os.OpenFile(AppConfig.Logging.FilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
			if err != nil {
				log.Printf("Failed to open log file: %v", err)
				output = os.Stdout
			} else {
				output = file
			}
		}
	default: // stdout
		output = os.Stdout
	}

	// Create handler based on format
	switch strings.ToLower(AppConfig.Logging.Format) {
	case "text":
		handler = slog.NewTextHandler(output, opts)
	default: // json
		handler = slog.NewJSONHandler(output, opts)
	}

	Logger = slog.New(handler)
	slog.SetDefault(Logger)

	// Log the initialization
	Logger.Info("Logger initialized",
		"level", AppConfig.Logging.Level,
		"format", AppConfig.Logging.Format,
		"output", AppConfig.Logging.Output,
		"add_source", AppConfig.Logging.AddSource,
	)
}

// GetLogger returns the configured slog logger
func GetLogger() *slog.Logger {
	return Logger
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsSlice(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		// Split by comma and trim spaces
		var result []string
		for _, item := range splitAndTrim(value, ",") {
			if item != "" {
				result = append(result, item)
			}
		}
		return result
	}
	return defaultValue
}

func splitAndTrim(s, sep string) []string {
	var result []string
	for _, item := range splitString(s, sep) {
		trimmed := trimString(item)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

func splitString(s, sep string) []string {
	// Simple string split implementation
	var result []string
	start := 0
	for i := 0; i <= len(s)-len(sep); i++ {
		if s[i:i+len(sep)] == sep {
			result = append(result, s[start:i])
			start = i + len(sep)
		}
	}
	result = append(result, s[start:])
	return result
}

func trimString(s string) string {
	// Simple string trim implementation
	start := 0
	end := len(s)

	for start < end && (s[start] == ' ' || s[start] == '\t' || s[start] == '\n') {
		start++
	}

	for end > start && (s[end-1] == ' ' || s[end-1] == '\t' || s[end-1] == '\n') {
		end--
	}

	return s[start:end]
}

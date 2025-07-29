package database

import (
	"fmt"
	"os"

	"github.com/manjurulhoque/swift-share/backend/config"
	"github.com/manjurulhoque/swift-share/backend/models"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func Connect() {
	cfg := config.AppConfig.Database
	appLogger := config.GetLogger()

	var dsn string
	var dialector gorm.Dialector

	switch cfg.Driver {
	case "postgres":
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
			cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port, cfg.SSLMode)
		dialector = postgres.Open(dsn)
	case "mysql":
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Name)
		dialector = mysql.Open(dsn)
	case "sqlite":
		dsn = cfg.Name
		dialector = sqlite.Open(dsn)
	default:
		appLogger.Error("Unsupported database driver", "driver", cfg.Driver)
		os.Exit(1)
	}

	// Configure GORM logger to be silent in production
	gormLogLevel := logger.Error
	if config.AppConfig.Server.GinMode == "debug" {
		gormLogLevel = logger.Info
	}

	var err error
	db, err = gorm.Open(dialector, &gorm.Config{
		Logger: logger.Default.LogMode(gormLogLevel),
	})

	if err != nil {
		appLogger.Error("Failed to connect to database",
			"error", err,
			"driver", cfg.Driver,
			"host", cfg.Host,
			"database", cfg.Name,
		)
		os.Exit(1)
	}

	appLogger.Info("Database connected successfully",
		"driver", cfg.Driver,
		"host", cfg.Host,
		"database", cfg.Name,
	)
}

func Migrate() {
	appLogger := config.GetLogger()

	appLogger.Info("Starting database migration")

	err := db.AutoMigrate(
		&models.User{},
		&models.File{},
		&models.ShareLink{},
		&models.Download{},
		&models.Upload{},
		&models.AuditLog{},
	)

	if err != nil {
		appLogger.Error("Failed to migrate database", "error", err)
		os.Exit(1)
	}

	appLogger.Info("Database migration completed successfully")
}

func GetDB() *gorm.DB {
	return db
}

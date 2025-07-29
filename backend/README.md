# Swift Share Backend

A professional file sharing platform built with Go, Gin, and GORM.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration, login, and profile management
- **File Management**: Upload, download, and manage files with proper validation
- **Share Links**: Create secure, time-limited, and password-protected share links
- **Admin Panel**: Administrative interface for user and system management
- **Audit Logging**: Comprehensive audit trail for all system activities
- **Multi-Database Support**: PostgreSQL, MySQL, and SQLite support
- **RESTful API**: Well-structured REST API with standardized responses
- **CORS Support**: Configurable CORS for frontend integration
- **File Validation**: Type and size validation for uploaded files

## 🛠 Tech Stack

- **Framework**: Gin (Go HTTP web framework)
- **ORM**: GORM (Go Object Relational Mapping)
- **Database**: PostgreSQL/MySQL/SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: go-playground/validator
- **File Upload**: Native Go multipart handling
- **Configuration**: Environment variables with godotenv

## 📁 Project Structure

```
backend/
├── cmd/server/          # Application entry point
│   └── main.go
├── config/              # Configuration management
│   └── config.go
├── controllers/         # HTTP request handlers
│   └── auth_controller.go
├── database/            # Database connection and migrations
│   └── connection.go
├── middleware/          # HTTP middleware
│   ├── auth.go
│   └── cors.go
├── models/              # Data models and structs
│   ├── user.go
│   ├── file.go
│   ├── share_link.go
│   ├── upload.go
│   ├── download.go
│   └── audit_log.go
├── routes/              # Route definitions
│   └── routes.go
├── services/            # Business logic layer
│   ├── user_service.go
│   └── audit_service.go
├── utils/               # Utility functions
│   ├── response.go
│   ├── validation.go
│   └── file.go
├── migrations/          # Database migrations (if needed)
├── uploads/             # File upload directory
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── go.mod               # Go module file
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Go 1.21 or higher
- PostgreSQL/MySQL/SQLite (depending on your choice)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swift-share/backend
   ```

2. **Install dependencies**
   ```bash
   go mod tidy
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Run the application**
   ```bash
   go run cmd/server/main.go
   ```

The server will start on `http://localhost:8080` by default.

## 🔧 Configuration

The application is configured using environment variables. Key configurations include:

### Server Configuration
- `PORT`: Server port (default: 8080)
- `HOST`: Server host (default: localhost)
- `GIN_MODE`: Gin mode (debug/release)

### Database Configuration
- `DB_DRIVER`: Database driver (postgres/mysql/sqlite)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

### JWT Configuration
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Token expiration time

### File Upload Configuration
- `MAX_FILE_SIZE`: Maximum file size in bytes
- `UPLOAD_PATH`: Upload directory path
- `ALLOWED_FILE_TYPES`: Comma-separated allowed file extensions

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (protected)
- `PUT /api/v1/auth/profile` - Update user profile (protected)
- `POST /api/v1/auth/logout` - User logout (protected)

### Files (Coming Soon)
- `GET /api/v1/files` - List user files (protected)
- `POST /api/v1/files/upload` - Upload file (protected)
- `GET /api/v1/files/:id` - Get file details (protected)
- `DELETE /api/v1/files/:id` - Delete file (protected)

### Share Links (Coming Soon)
- `GET /api/v1/shares` - List user shares (protected)
- `POST /api/v1/shares` - Create share link (protected)
- `GET /api/v1/public/share/:token` - Access shared file (public)

### Admin (Coming Soon)
- `GET /api/v1/admin/users` - List all users (admin)
- `GET /api/v1/admin/stats` - System statistics (admin)
- `GET /api/v1/admin/audit-logs` - Audit logs (admin)

### Health Check
- `GET /health` - Health check endpoint
- `GET /` - API documentation

## 🏗 Database Schema

### Users Table
- ID (UUID, Primary Key)
- FirstName, LastName, Email
- Password (hashed)
- IsActive, IsAdmin, EmailVerified
- LastLoginAt, CreatedAt, UpdatedAt

### Files Table
- ID (UUID, Primary Key)
- UserID (Foreign Key)
- FileName, OriginalName, FilePath
- FileSize, MimeType, FileExtension
- IsPublic, DownloadCount
- Description, Tags
- CreatedAt, UpdatedAt

### Share Links Table
- ID (UUID, Primary Key)
- UserID, FileID (Foreign Keys)
- Token, Password (optional)
- ExpiresAt, MaxDownloads, DownloadCount
- IsActive, Description
- CreatedAt, UpdatedAt

### Audit Logs Table
- ID (UUID, Primary Key)
- UserID (Foreign Key, optional)
- Action, Resource, ResourceID
- Details, IPAddress, UserAgent, Status
- CreatedAt

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable CORS policies
- **Audit Logging**: Complete audit trail for security monitoring
- **File Validation**: Type and size restrictions for uploads

## 📊 Monitoring & Logging

- **Audit Logs**: All user actions are logged
- **Health Checks**: Built-in health check endpoint
- **Request Logging**: Gin's built-in request logging
- **Error Handling**: Standardized error responses

## 🧪 Testing

```bash
# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific package tests
go test ./controllers
```

## 🚀 Deployment

### Using Go Binary
```bash
# Build for production
go build -o swift-share cmd/server/main.go

# Run the binary
./swift-share
```

### Using Docker
```dockerfile
# Create Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o swift-share cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/swift-share .
CMD ["./swift-share"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please create an issue in the repository. 
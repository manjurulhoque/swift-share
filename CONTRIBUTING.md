# Contributing to Swift Share 🤝

Thank you for your interest in contributing to Swift Share! We welcome contributions from developers of all skill levels. This guide will help you get started and ensure your contributions align with our project standards.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** - Treat everyone with respect and kindness
- **Be inclusive** - Welcome newcomers and help them learn
- **Be constructive** - Provide helpful feedback and suggestions
- **Be patient** - Remember that everyone has different experience levels
- **Be professional** - Keep discussions focused on the project

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Go 1.23+** installed
- **Node.js 18+** installed
- **Git** installed
- **PostgreSQL/MySQL/SQLite** database
- **Docker** (optional, for containerized development)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/swift-share.git
   cd swift-share
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/manjurulhoque/swift-share.git
   ```

## 🛠 Development Setup

### Backend Setup

```bash
cd backend

# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=swift_share_dev
# DB_USER=your_username
# DB_PASSWORD=your_password

# Run database migrations (if any)
# go run cmd/migrate/main.go

# Start the development server
go run cmd/server/main.go
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- API Documentation: `http://localhost:8080/swagger/index.html`

## 🔄 Contributing Process

### 1. Create a Branch

Always create a new branch for your changes:

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
# or
git checkout -b docs/update-readme
```

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Backend tests
cd backend
go test ./...

# Frontend tests
cd frontend
npm test

# Linting
npm run lint
```

### 4. Commit Your Changes

Follow our commit message guidelines (see below).

### 5. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

## 📝 Coding Standards

### Go (Backend)

- Follow [Effective Go](https://golang.org/doc/effective_go.html) guidelines
- Use `gofmt` to format your code
- Use meaningful variable and function names
- Add comments for exported functions and types
- Keep functions small and focused
- Use `golangci-lint` for additional checks

```go
// Good
func (s *UserService) CreateUser(req *models.UserRegisterRequest) (*models.User, error) {
    // Implementation
}

// Bad
func (s *UserService) CreateUser(req *models.UserRegisterRequest) (*models.User, error) {
    // Implementation
}
```

### TypeScript/React (Frontend)

- Follow [React Best Practices](https://react.dev/learn)
- Use TypeScript strictly - avoid `any` types
- Use functional components with hooks
- Follow the existing component structure
- Use Tailwind CSS for styling
- Keep components small and focused

```tsx
// Good
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
};

// Bad
export const UserCard = (props: any) => {
  return <div>{props.user.name}</div>;
};
```

### Database

- Use meaningful table and column names
- Add proper indexes for performance
- Use foreign key constraints
- Follow naming conventions (snake_case for columns)

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add password reset functionality
fix(api): resolve CORS issue with file uploads
docs(readme): update installation instructions
test(files): add unit tests for file validation
refactor(storage): simplify S3 storage implementation
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows our coding standards
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No merge conflicts with main branch
- [ ] Commit messages follow our guidelines

### PR Template

When creating a PR, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one maintainer reviews the code
3. **Testing**: Manual testing may be required
4. **Approval**: Maintainer approves and merges

## 🐛 Issue Guidelines

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if it's already fixed in the latest version
- Gather relevant information

### Bug Reports

Use this template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific package tests
go test ./controllers/...

# Run tests with verbose output
go test -v ./...
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Integration Testing

- Test API endpoints with tools like Postman or curl
- Test file upload/download functionality
- Test authentication flows
- Test sharing and collaboration features

## 📚 Documentation

### Code Documentation

- Add comments for complex logic
- Document API endpoints with Swagger annotations
- Update README files when adding new features
- Keep inline documentation up to date

### API Documentation

We use Swagger/OpenAPI for API documentation:

```go
// @Summary Create a new user
// @Description Create a new user account
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.UserRegisterRequest true "User data"
// @Success 201 {object} models.UserResponse
// @Router /api/users [post]
func CreateUser(c *gin.Context) {
    // Implementation
}
```

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **Security**: Security audits, vulnerability fixes
- **Performance**: Optimization, caching improvements
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: API docs, user guides, tutorials
- **UI/UX**: Frontend improvements, accessibility
- **DevOps**: CI/CD improvements, deployment scripts
- **Features**: New functionality, integrations

## 🆘 Getting Help

- **Discord**: Join our community Discord server
- **GitHub Discussions**: Use GitHub Discussions for questions
- **Issues**: Create an issue for bugs or feature requests
- **Email**: Contact maintainers directly for sensitive issues

## 🏆 Recognition

Contributors will be recognized in:

- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributor graph**
- **Community highlights**

## 📄 License

By contributing to Swift Share, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Thank you for contributing to Swift Share!** 🎉

Your contributions help make file sharing faster, more secure, and more accessible for everyone. We appreciate your time and effort in making this project better.

*Questions? Feel free to reach out to the maintainers or open a discussion.*

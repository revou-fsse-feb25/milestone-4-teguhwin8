# Contributing to Revo Bank Backend API

Thank you for your interest in contributing to the Revo Bank Backend API! This document provides guidelines and instructions for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Documentation](#documentation)

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

### Our Standards

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Inclusive**: Welcome contributors from all backgrounds
- **Be Professional**: Keep discussions focused and constructive
- **Be Patient**: Help newcomers learn and grow
- **Be Collaborative**: Work together towards common goals

### Unacceptable Behavior

- Harassment, discrimination, or hate speech
- Personal attacks or inflammatory comments
- Trolling or intentionally disruptive behavior
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git** for version control
- **VS Code** (recommended) with recommended extensions

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/milestone-4-teguhwin8.git
   cd milestone-4-teguhwin8
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/revou-fsse-feb25/milestone-4-teguhwin8.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Configure your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/revobank_dev"
JWT_SECRET="your-super-secret-jwt-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

### 5. Verify Setup

```bash
# Test API health
curl http://localhost:3000/api/health

# Run tests
npm test
```

## 📁 Project Structure

Understanding the project structure will help you contribute effectively:

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts    # Auth endpoints
│   ├── auth.service.ts       # Auth business logic
│   ├── auth.module.ts        # Module definition
│   ├── dto/                  # Data Transfer Objects
│   ├── guards/               # Authentication guards
│   └── strategies/           # Passport strategies
├── user/                # User management module
│   ├── user.controller.ts    # User endpoints
│   ├── user.service.ts       # User business logic
│   ├── user.module.ts        # Module definition
│   └── dto/                  # User DTOs
├── common/              # Shared utilities
│   ├── decorators/           # Custom decorators
│   ├── guards/               # Shared guards
│   └── interfaces/           # TypeScript interfaces
├── prisma/              # Database schema and migrations
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
└── main.ts              # Application entry point
```

### Module Organization

Each feature module should follow this structure:

- **Controller**: HTTP request handling
- **Service**: Business logic implementation
- **Module**: Dependency injection configuration
- **DTOs**: Request/response data structures
- **Tests**: Unit and integration tests

## 💻 Coding Standards

### TypeScript Guidelines

- **Use strict TypeScript**: Enable all strict compiler options
- **Type everything**: Avoid `any` type, use proper interfaces
- **Use interfaces**: Define clear contracts for data structures
- **Import organization**: Group and sort imports logically

#### Example:

```typescript
// Good ✅
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }
}

// Bad ❌
export class UserService {
  constructor(private prisma: any) {}

  async findById(id: any): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}
```

### NestJS Best Practices

1. **Use Dependency Injection**: Properly inject dependencies
2. **Use Decorators**: Leverage NestJS decorators appropriately
3. **Error Handling**: Use built-in HTTP exceptions
4. **Validation**: Use class-validator for input validation
5. **Guards**: Implement proper authentication/authorization

### Database Guidelines

1. **Use Prisma**: Follow Prisma conventions for database operations
2. **Type Safety**: Leverage Prisma's type generation
3. **Migrations**: Always create migrations for schema changes
4. **Relationships**: Properly define model relationships

## 🧪 Testing Guidelines

### Test Requirements

All contributions must include appropriate tests:

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test complete workflows

### Test Structure

```typescript
// Example test structure
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Act
      const result = await service.create(userData);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.password).toBeUndefined();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Test Coverage Requirements

- **Minimum Coverage**: 90% for new code
- **Statements**: 95%
- **Branches**: 90%
- **Functions**: 95%
- **Lines**: 95%

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commits ✅
git commit -m "feat(auth): add JWT token refresh functionality"
git commit -m "fix(user): resolve password hashing issue"
git commit -m "docs(api): update endpoint documentation"
git commit -m "test(auth): add integration tests for login flow"

# Bad commits ❌
git commit -m "fix stuff"
git commit -m "update code"
git commit -m "changes"
```

### Commit Best Practices

1. **Atomic commits**: One logical change per commit
2. **Clear messages**: Descriptive and concise
3. **Present tense**: Use present tense ("add" not "added")
4. **Imperative mood**: Use imperative mood ("fix" not "fixes")

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the guidelines

4. **Run tests**:

   ```bash
   npm test
   npm run test:e2e
   ```

5. **Update documentation** if needed

### Pull Request Requirements

- [ ] **Clear description** of what changes were made
- [ ] **All tests pass** (unit, integration, E2E)
- [ ] **Code coverage** meets minimum requirements
- [ ] **Documentation updated** for new features
- [ ] **No linting errors** or warnings
- [ ] **Follows coding standards** outlined above

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added for new functionality
- [ ] All tests pass
```

### Review Process

1. **Automated checks** must pass (tests, linting)
2. **Peer review** by at least one maintainer
3. **Address feedback** promptly and professionally
4. **Rebase if needed** to maintain clean history

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for answers
3. **Reproduce the issue** consistently
4. **Gather relevant information**

### Issue Template

#### Bug Report

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.17.0]
- npm version: [e.g. 9.6.7]
- PostgreSQL version: [e.g. 14.8]

**Additional context**
Add any other context about the problem here.
```

#### Feature Request

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## 📚 Documentation

### Documentation Types

1. **Code Comments**: Inline documentation for complex logic
2. **API Documentation**: Endpoint specifications and examples
3. **README Updates**: Keep README.md current
4. **Module Documentation**: Feature-specific guides

### Documentation Standards

- **Clear and concise**: Easy to understand language
- **Up-to-date**: Reflect current code state
- **Examples included**: Show real usage
- **Well structured**: Use consistent formatting

### Updating Documentation

When contributing features:

1. Update relevant README sections
2. Add/update API documentation
3. Include code examples
4. Update changelog

## 🏆 Recognition

### Contributors

We recognize contributions in several ways:

- **Contributors list** in README.md
- **Changelog mentions** for significant changes
- **GitHub contributors** graph
- **Special thanks** in release notes

### Becoming a Maintainer

Regular contributors may be invited to become maintainers based on:

- **Quality contributions** over time
- **Community involvement** and helpfulness
- **Technical expertise** in relevant areas
- **Commitment to project goals**

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: [maintainer@email.com] for sensitive issues

### Development Help

- **Setup Issues**: Create an issue with "setup" label
- **Documentation**: Check existing docs first
- **Code Questions**: Use GitHub discussions
- **Urgent Issues**: Email maintainers directly

## 🙏 Thank You

Thank you for contributing to the Revo Bank Backend API! Your contributions help make this project better for everyone.

### First-time Contributors

Special welcome to first-time contributors! Don't hesitate to:

- Ask questions if anything is unclear
- Start with smaller issues labeled "good first issue"
- Join discussions to learn about the project
- Share your ideas for improvements

Every contribution, no matter how small, is valued and appreciated!

---

_Last updated: January 27, 2025_

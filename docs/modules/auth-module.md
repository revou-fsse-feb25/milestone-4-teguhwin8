# Auth Module Documentation

## Overview

The Auth module provides complete authentication functionality for the Revo Bank backend application, including user registration, login, JWT token management, and route protection.

## Features Implemented

### ✅ Authentication Endpoints

- **POST /auth/register** - User registration with automatic login
- **POST /auth/login** - User authentication with JWT token generation

### ✅ JWT Implementation

- **JWT Strategy** - Passport JWT strategy for token validation
- **JWT Auth Guard** - Global authentication guard with public route support
- **Token Management** - Configurable token expiration and secret

### ✅ Security Features

- **Password Integration** - Uses UserService for password validation
- **Global Protection** - All routes protected by default (except @Public)
- **Token Validation** - Automatic user validation from JWT payload
- **Public Routes** - @Public decorator for non-protected endpoints

### ✅ DTOs & Validation

- **LoginDto** - Email and password validation
- **RegisterDto** - Complete user registration validation
- **AuthResponseDto** - Standardized authentication response

### ✅ Testing

- Comprehensive unit tests for AuthService
- Unit tests for AuthController
- Mocked dependencies for isolated testing

## API Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "7d",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-27T10:00:00.000Z"
  }
}
```

### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register response

### Protected Routes

```http
GET /user/profile
Authorization: Bearer <jwt-token>
```

## JWT Configuration

### Environment Variables

```bash
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

### JWT Payload Structure

```typescript
{
  sub: number,      // User ID
  email: string,    // User email
  iat: number,      // Issued at
  exp: number       // Expires at
}
```

## Guard & Strategy Implementation

### Global JWT Guard

- Applied to all routes by default via APP_GUARD
- Checks for @Public decorator to allow non-protected routes
- Validates JWT token from Authorization header

### JWT Strategy

- Extracts token from Bearer header
- Validates token signature and expiration
- Fetches user data and injects into request

### Public Routes

Use `@Public()` decorator for routes that don't require authentication:

```typescript
@Public()
@Get('health')
checkHealth() {
  return { status: 'OK' };
}
```

## Error Handling

- **UnauthorizedException**: Invalid credentials or token
- **ConflictException**: User already exists during registration
- **ValidationException**: Invalid input data

## Integration Points

### User Module Integration

- Uses UserService for user creation and validation
- Leverages existing password hashing and user management
- Returns UserResponseDto for consistent user data format

### Database Integration

- Inherits Prisma integration from UserService
- No direct database calls in AuthService
- Maintains separation of concerns

## Security Considerations

- JWT secret should be strong and environment-specific
- Tokens include expiration time for security
- Password validation delegated to UserService
- No sensitive data in JWT payload
- Global guard ensures all routes are protected by default

## Testing

Run auth module tests:

```bash
npm test -- --testPathPattern=auth
```

## File Structure

```
src/auth/
├── decorators/
│   └── public.decorator.ts
├── dto/
│   ├── auth-response.dto.ts
│   ├── login.dto/
│   │   └── login.dto.ts
│   └── register.dto.ts
├── guards/
│   └── jwt-auth.guard.ts
├── strategies/
│   └── jwt.strategy.ts
├── auth.controller.ts
├── auth.controller.spec.ts
├── auth.service.ts
├── auth.service.spec.ts
└── auth.module.ts
```

## Usage Examples

### Registration Flow

1. User submits registration data
2. AuthService creates user via UserService
3. JWT token generated with user payload
4. User data and token returned

### Login Flow

1. User submits credentials
2. AuthService validates via UserService
3. JWT token generated for valid user
4. User data and token returned

### Protected Route Access

1. Client sends request with Bearer token
2. JwtAuthGuard intercepts request
3. JwtStrategy validates token
4. User data injected into request
5. Route handler accesses user via @CurrentUser

The Auth module is now **complete** and fully integrated with the User module! 🔐

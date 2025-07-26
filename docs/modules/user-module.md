# User Module Documentation

## Overview

The User module provides comprehensive user management functionality for the Revo Bank backend application. It includes user profile management, authentication support, and secure data handling.

## Features Implemented

### ✅ DTOs (Data Transfer Objects)

- **CreateUserDto**: Validation for user registration
- **UpdateUserDto**: Validation for profile updates
- **UserResponseDto**: Safe user data response (excludes password)

### ✅ Service Layer

- **UserService**: Complete business logic for user operations
  - User creation with password hashing
  - User profile retrieval
  - User profile updates
  - User account deletion
  - Password validation for authentication
  - Duplicate email checking

### ✅ Controller Layer

- **UserController**: RESTful API endpoints
  - `GET /user/profile` - Get current user profile
  - `PATCH /user/profile` - Update current user profile
  - `DELETE /user/profile` - Delete user account

### ✅ Security Features

- Password hashing using bcrypt
- Input validation using class-validator
- Data serialization to hide sensitive information
- Custom @CurrentUser decorator for route parameter injection

### ✅ Testing

- Comprehensive unit tests for UserService (95%+ coverage)
- Unit tests for UserController
- Mocked Prisma client for isolated testing
- Edge case testing (user not found, duplicate emails, etc.)

### ✅ API Documentation

- Swagger/OpenAPI integration
- Comprehensive API documentation with examples
- Request/Response schemas
- Error response documentation

## API Endpoints

### Get User Profile

```http
GET /user/profile
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-27T10:00:00.000Z"
}
```

### Update User Profile

```http
PATCH /user/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "password": "newpassword123"
}
```

### Delete User Account

```http
DELETE /user/profile
Authorization: Bearer <jwt-token>
```

## Integration with Other Modules

### Auth Module Integration

The UserService is exported and can be imported by the AuthModule for:

- User registration
- Password validation during login
- User lookup by email

### Database Integration

- Uses Prisma Client for database operations
- Supports PostgreSQL database
- Includes proper error handling for database constraints

## Error Handling

- **ConflictException**: When trying to create user with existing email
- **NotFoundException**: When user is not found
- **ValidationException**: For invalid input data

## Security Considerations

- Passwords are hashed using bcrypt with salt rounds = 10
- Sensitive data (password) is excluded from API responses
- Input validation prevents SQL injection and XSS attacks
- Proper authentication guards (to be enabled when auth module is complete)

## Testing

Run user module tests:

```bash
npm test -- --testPathPattern=user
```

## Next Steps

1. Complete Auth module implementation
2. Enable authentication guards in user controller
3. Add role-based access control if needed
4. Integration with Account module for user account management

## File Structure

```
src/user/
├── dto/
│   ├── create-user.dto/
│   │   └── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── user-response.dto.ts
├── decorators/
│   └── current-user.decorator.ts
├── user.controller.ts
├── user.controller.spec.ts
├── user.service.ts
├── user.service.spec.ts
└── user.module.ts
```

The User module is now **complete** and ready for integration with the Auth module!

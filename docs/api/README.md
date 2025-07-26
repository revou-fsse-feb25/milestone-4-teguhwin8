# API Reference Documentation

## Overview

This document provides comprehensive information about all available endpoints in the Revo Bank API. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com/api`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle

- **Expiration**: 7 days (configurable)
- **Refresh**: Currently not implemented (re-login required)
- **Storage**: Client-side storage (localStorage/sessionStorage recommended)

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "data": {
    /* response data */
  },
  "status": "success",
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  },
  "status": "error",
  "statusCode": 400
}
```

## HTTP Status Codes

| Code | Meaning               | Description                             |
| ---- | --------------------- | --------------------------------------- |
| 200  | OK                    | Request successful                      |
| 201  | Created               | Resource created successfully           |
| 204  | No Content            | Request successful, no content returned |
| 400  | Bad Request           | Invalid request parameters              |
| 401  | Unauthorized          | Authentication required                 |
| 403  | Forbidden             | Access denied                           |
| 404  | Not Found             | Resource not found                      |
| 409  | Conflict              | Resource already exists                 |
| 422  | Unprocessable Entity  | Validation failed                       |
| 500  | Internal Server Error | Server error                            |

## Endpoints

### 🔐 Authentication Endpoints

#### Register User

Creates a new user account and returns authentication token.

```http
POST /auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**

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

**Errors:**

- `400` - Validation failed
- `409` - Email already exists

---

#### Login User

Authenticates user and returns JWT token.

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

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

**Errors:**

- `400` - Validation failed
- `401` - Invalid credentials

### 👤 User Management Endpoints

#### Get User Profile

Retrieves current authenticated user's profile.

```http
GET /user/profile
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-27T10:00:00.000Z"
}
```

**Errors:**

- `401` - Token invalid/expired
- `404` - User not found

---

#### Update User Profile

Updates current user's profile information.

```http
PATCH /user/profile
Authorization: Bearer <token>
```

**Request Body (partial update):**

```json
{
  "name": "John Doe Updated",
  "password": "newpassword123"
}
```

**Response (200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe Updated",
  "createdAt": "2025-01-27T10:00:00.000Z"
}
```

**Errors:**

- `400` - Validation failed
- `401` - Token invalid/expired
- `404` - User not found

---

#### Delete User Account

Permanently deletes current user's account.

```http
DELETE /user/profile
Authorization: Bearer <token>
```

**Response (204):**
No content returned.

**Errors:**

- `401` - Token invalid/expired
- `404` - User not found

### ❤️ System Endpoints

#### Health Check

Checks if the API is running and accessible.

```http
GET /
```

**Response (200):**

```
Hello World!
```

## Request/Response Examples

### cURL Examples

#### Register and Login Flow

```bash
# 1. Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# 2. Extract token from response and use for authenticated requests
TOKEN="your_jwt_token_here"

# 3. Get profile
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer $TOKEN"

# 4. Update profile
curl -X PATCH http://localhost:3000/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Updated Name"}'
```

### JavaScript/Fetch Examples

#### Registration

```javascript
const response = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
  }),
});

const data = await response.json();
const token = data.access_token;
```

#### Authenticated Requests

```javascript
const response = await fetch('http://localhost:3000/user/profile', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const userData = await response.json();
```

## Validation Rules

### User Registration/Update

- **Email**: Must be valid email format, required for registration
- **Password**: Minimum 6 characters, required for registration
- **Name**: String, minimum 1 character, required for registration

### Common Validation Errors

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "email must be an email"
      },
      {
        "field": "password",
        "message": "password must be longer than or equal to 6 characters"
      }
    ]
  },
  "status": "error",
  "statusCode": 400
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider:

- **Registration**: 5 requests per hour per IP
- **Login**: 10 requests per hour per IP
- **API calls**: 1000 requests per hour per user

## CORS Configuration

The API supports cross-origin requests. Current configuration allows:

- **Origins**: All origins (development)
- **Methods**: GET, POST, PATCH, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

## Coming Soon

### 🏦 Account Endpoints

- `POST /accounts` - Create bank account
- `GET /accounts` - List user accounts
- `GET /accounts/:id` - Get account details
- `PATCH /accounts/:id` - Update account
- `DELETE /accounts/:id` - Close account

### 💸 Transaction Endpoints

- `POST /transactions/deposit` - Deposit money
- `POST /transactions/withdraw` - Withdraw money
- `POST /transactions/transfer` - Transfer between accounts
- `GET /transactions` - Transaction history
- `GET /transactions/:id` - Transaction details

## Swagger/OpenAPI

Interactive API documentation is available at:

- **Development**: `http://localhost:3000/api`
- **JSON Schema**: `http://localhost:3000/api-json`

The Swagger UI provides:

- ✅ Interactive endpoint testing
- ✅ Request/response schemas
- ✅ Authentication testing
- ✅ Example requests and responses

## Support

For API support:

- **Issues**: [GitHub Issues](https://github.com/revou-fsse-feb25/milestone-4-teguhwin8/issues)
- **Documentation**: [docs/](../README.md)
- **Testing Tools**: [postman/](../testing/README.md)

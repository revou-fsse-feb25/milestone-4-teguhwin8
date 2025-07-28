# Revo Bank API - cURL Testing Commands

This file contains cURL commands for testing all API endpoints manually without Postman, including role-based features.

## Environment Setup

```bash
# Set base URL (change as needed)
export BASE_URL="http://localhost:3000"
export ACCESS_TOKEN="" # Will be set after login/register
export ADMIN_TOKEN=""  # Will be set after admin login
```

## 1. Health Check (Public)

```bash
# Test if API is running
curl -X GET "$BASE_URL/" \
  -H "Content-Type: application/json"

# Expected: "Hello World!"
```

## 2. User Registration

```bash
# Register new user (defaults to USER role)
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teguhwin8@gmail.com",
    "password": "password123",
    "name": "Teguh Widodo"
  }'

# Save the access_token from response for next requests
# Example response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "Bearer",
#   "expires_in": "7d",
#   "user": {
#     "id": 1,
#     "email": "teguhwin8@gmail.com",
#     "name": "Teguh Widodo",
#     "role": "USER",
#     "createdAt": "2025-01-27T10:00:00.000Z"
#   }
# }
```

## 3. User Login

```bash
# Login existing user
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teguhwin8@gmail.com",
    "password": "password123"
  }'

# Copy access_token from response
export ACCESS_TOKEN="your_jwt_token_here"

# Login as admin (for testing admin features)
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.revobank@gmail.com",
    "password": "password123"
  }'

# Copy admin access_token
export ADMIN_TOKEN="admin_jwt_token_here"
```

## 4. Get User Profile (Protected)

```bash
# Get current user profile
curl -X GET "$BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected response:
# {
#   "id": 1,
#   "email": "teguhwin8@gmail.com",
#   "name": "Teguh Widodo",
#   "createdAt": "2025-01-27T10:00:00.000Z"
# }
```

## 5. Update User Profile (Protected)

```bash
# Update user name
curl -X PATCH "$BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "John Doe Updated"
  }'

# Update user password
curl -X PATCH "$BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "password": "newpassword123"
  }'

# Update both name and password
curl -X PATCH "$BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "John Doe Final",
    "password": "finalpassword123"
  }'
```

## 6. Delete User Account (Protected)

```bash
# Delete current user account
curl -X DELETE "$BASE_URL/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: # Expected: 204 No Content (no response body)
```

## 6. Account Management (Protected)

```bash
# Create new account
curl -X POST "$BASE_URL/accounts"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer $ACCESS_TOKEN"
  -d '{}'

# Get all user accounts
curl -X GET "$BASE_URL/accounts"
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Get specific account by ID
curl -X GET "$BASE_URL/accounts/1"
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Delete account
curl -X DELETE "$BASE_URL/accounts/1"
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## 7. Transaction Management (Protected)

```bash
# Deposit money (Rp 500,000)
curl -X POST "$BASE_URL/transactions/deposit"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer $ACCESS_TOKEN"
  -d '{
    "accountId": 1,
    "amount": 500000
  }'

# Withdraw money (Rp 100,000)
curl -X POST "$BASE_URL/transactions/withdraw"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer $ACCESS_TOKEN"
  -d '{
    "accountId": 1,
    "amount": 100000
  }'

# Transfer money between accounts (Rp 250,000)
curl -X POST "$BASE_URL/transactions/transfer"
  -H "Content-Type: application/json"
  -H "Authorization: Bearer $ACCESS_TOKEN"
  -d '{
    "fromAccountId": 1,
    "toAccountId": 2,
    "amount": 250000
  }'

# Get all user transactions
curl -X GET "$BASE_URL/transactions"
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Get specific transaction by ID
curl -X GET "$BASE_URL/transactions/1"
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## 8. Testing with Seeded Data

```bash
# Login with Indonesian test user
curl -X POST "$BASE_URL/auth/login"
  -H "Content-Type: application/json"
  -d '{
    "email": "teguhwin8@gmail.com",
    "password": "password123"
  }'

# Check existing accounts (should have IDR balances)
curl -X GET "$BASE_URL/accounts"
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Check existing transactions (should have Indonesian transaction history)
curl -X GET "$BASE_URL/transactions"
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Notes

````

## Error Testing

### 1. Test Unauthorized Access

```bash
# Try to access protected route without token
curl -X GET "$BASE_URL/user/profile" \
  -H "Content-Type: application/json"

# Expected: 401 Unauthorized
````

### 2. Test Invalid Token

```bash
# Try with invalid token
curl -X GET "$BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token"

# Expected: 401 Unauthorized
```

### 3. Test Duplicate Registration

```bash
# Try to register same email twice
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teguhwin8@gmail.com",
    "password": "password123",
    "name": "Teguh Widodo Duplicate"
  }'

# Expected: 409 Conflict
```

### 4. Test Invalid Login

```bash
# Try login with wrong password
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teguhwin8@gmail.com",
    "password": "wrongpassword"
  }'

# Expected: 401 Unauthorized
```

### 5. Test Validation Errors

```bash
# Invalid email format
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123",
    "name": "Test User"
  }'

# Short password
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123",
    "name": "Test User"
  }'

# Missing required fields
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Expected: 400 Bad Request with validation errors
```

## Admin-Only Commands

### Admin User Management

```bash
# Register new admin user (requires admin token)
curl -X POST "$BASE_URL/auth/register-admin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "email": "newadmin@revobank.com",
    "password": "password123",
    "name": "New Admin",
    "role": "ADMIN"
  }'

# Get all users (admin only)
curl -X GET "$BASE_URL/user/all" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Get specific user by ID (admin only)
curl -X GET "$BASE_URL/user/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Update user role (admin only)
curl -X PATCH "$BASE_URL/user/1/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "role": "ADMIN"
  }'
```

### Admin System Monitoring

```bash
# Get all accounts in system (admin only)
curl -X GET "$BASE_URL/accounts/admin/all" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Get all transactions in system (admin only)
curl -X GET "$BASE_URL/transactions/admin/all" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Role-Based Error Testing

```bash
# Try admin endpoint with regular user token (should fail)
curl -X GET "$BASE_URL/user/all" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: 403 Forbidden

# Try accessing other user's resources
curl -X GET "$BASE_URL/accounts/999" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: 403 Forbidden or 404 Not Found
```

## Complete Testing Flow

```bash
#!/bin/bash

# Complete API testing script
BASE_URL="http://localhost:3000"

echo "=== Revo Bank API Testing ==="

# 1. Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/" && echo

# 2. Register User
echo "2. Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo "$REGISTER_RESPONSE"

# Extract token (requires jq)
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token')
echo "Token: $ACCESS_TOKEN"

# 3. Get Profile
echo "3. Getting user profile..."
curl -s -X GET "$BASE_URL/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

# 4. Update Profile
echo "4. Updating user profile..."
curl -s -X PATCH "$BASE_URL/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"name": "Test User Updated"}' | jq

# 5. Login Test
echo "5. Testing login..."
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq

echo "=== Testing Complete ==="
```

## Notes

- Replace `$BASE_URL` with your actual API URL
- Replace `$ACCESS_TOKEN` with the JWT token from login/register response
- Add `-v` flag to curl for verbose output and debugging
- Use `jq` command to pretty-print JSON responses
- Tokens expire in 7 days (configurable in backend)

## Response Status Codes

- **200 OK** - Successful GET/PATCH requests
- **201 Created** - Successful registration
- **204 No Content** - Successful deletion
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Invalid/missing token or credentials
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate user registration

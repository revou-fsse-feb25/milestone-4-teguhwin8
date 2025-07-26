# Postman Collection - Revo Bank API

This documentation explains how to use the Postman collection for testing the Revo Bank API endpoints.

## Files Location

The Postman files are located in the root `postman/` folder:

1. **../postman/Revo-Bank-API.postman_collection.json** - Main collection with all API endpoints
2. **../postman/Revo-Bank.postman_environment.json** - Environment variables for different setups

## 🇮🇩 Indonesian Test Data

After running `npx prisma db seed`, you can use these pre-seeded Indonesian accounts:

| Email                      | Password      | Name           | Account Balance (IDR)       |
| -------------------------- | ------------- | -------------- | --------------------------- |
| `budi.santoso@gmail.com`   | `password123` | Budi Santoso   | Rp 5.000.000 + Rp 1.500.000 |
| `sari.wijaya@gmail.com`    | `password123` | Sari Wijaya    | Rp 3.250.000                |
| `agus.pratama@gmail.com`   | `password123` | Agus Pratama   | Rp 8.750.000                |
| `admin.revobank@gmail.com` | `password123` | Admin RevoBank | Rp 50.000.000               |

## How to Import

### 1. Import Collection

1. Open Postman
2. Click "Import" button
3. Select `../postman/Revo-Bank-API.postman_collection.json` from the project root
4. Collection will appear in your workspace

### 2. Import Environment

1. In Postman, go to "Environments" tab
2. Click "Import"
3. Select `../postman/Revo-Bank.postman_environment.json` from the project root
4. Select the "Revo Bank Environment" from dropdown

## API Endpoints Included

### 🔐 Authentication

- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - Login user

### 👤 User Management

- **GET** `/user/profile` - Get user profile (Protected)
- **PATCH** `/user/profile` - Update user profile (Protected)
- **DELETE** `/user/profile` - Delete user account (Protected)

### ❤️ Health Check

- **GET** `/` - Application health check (Public)

## Environment Variables

| Variable       | Description        | Auto-populated          |
| -------------- | ------------------ | ----------------------- |
| `base_url`     | API base URL       | Manual                  |
| `access_token` | JWT token          | ✅ After login/register |
| `user_id`      | Current user ID    | ✅ After login/register |
| `user_email`   | Current user email | ✅ After login/register |

## Testing Flow

### Option 1: New User Registration

1. **Register User** - Creates account and gets token
2. **Get Profile** - Verify profile data
3. **Update Profile** - Test profile update
4. **Delete Account** - Clean up (optional)

### Option 2: Existing User Login

1. **Login User** - Authenticate and get token
2. **Get Profile** - Verify profile data
3. **Update Profile** - Test profile update

## Automated Testing Features

### Test Scripts

Each request includes automated tests that verify:

- ✅ Correct HTTP status codes
- ✅ Response structure validation
- ✅ Token presence in auth responses
- ✅ Password field exclusion from responses

### Token Management

- 🔄 Automatically saves JWT token after successful login/register
- 🔄 Automatically includes token in Authorization header for protected routes
- 🔄 Clears tokens after account deletion

### Pre-request Scripts

- 📝 Logs request URLs for debugging
- 📝 Global logging for all requests

## Sample Test Data

### Registration/Login User Data

```json
{
  "email": "budi.santoso@gmail.com",
  "password": "password123",
  "name": "Budi Santoso"
}
```

### Profile Update Data

```json
{
  "name": "John Doe Updated"
}
```

### Password Update Data

```json
{
  "password": "newpassword123"
}
```

## Environment Setup

### Local Development

```
base_url: http://localhost:3000
```

### Production/Staging

Update `base_url` to your deployed API URL:

```
base_url: https://your-api-domain.com
```

## Error Testing

The collection includes scenarios for testing:

- ✅ Successful operations
- ❌ Invalid credentials
- ❌ Unauthorized access
- ❌ Validation errors
- ❌ Duplicate user registration

## Quick Start

1. **Import both files into Postman**
2. **Select "Revo Bank Environment"**
3. **Start with "Health Check" to verify API is running**
4. **Register a new user or login with existing credentials**
5. **Test protected endpoints with the auto-generated token**

## Tips for Usage

- 🔄 Run requests in sequence for best results
- 📝 Check the "Tests" tab to see automated validations
- 🔍 Use Console (View → Show Postman Console) for debugging
- 💾 Environment variables are automatically managed
- 🔒 Token expires in 7 days (configurable in backend)

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Ensure you have a valid token
   - Try logging in again to refresh token

2. **Connection Error**
   - Check if backend server is running on port 3000
   - Verify `base_url` in environment

3. **404 Not Found**
   - Verify API endpoint URLs
   - Check if routes are properly implemented

### Debug Steps

1. Check Postman Console for detailed logs
2. Verify environment variables are set correctly
3. Test health check endpoint first
4. Ensure JWT token is present in Authorization header

Happy Testing! 🚀

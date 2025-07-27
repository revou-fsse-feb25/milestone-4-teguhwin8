# Role-Based Access Control (RBAC) Documentation

## Overview

The Revo Bank API implements a comprehensive Role-Based Access Control system with two main roles:

- **USER**: Regular bank customers with access to personal banking operations
- **ADMIN**: Bank administrators with elevated privileges for system management

## User Roles

### USER Role

- Default role assigned to new registrations
- Can access personal banking features:
  - Account management (personal accounts only)
  - Transactions (personal transactions only)
  - Profile management

### ADMIN Role

- Elevated privileges for system administration
- Can access all USER features plus:
  - User management (view all users, update roles)
  - System-wide account viewing
  - System-wide transaction monitoring
  - Admin user creation

## Authentication & Authorization Flow

1. **Authentication**: Users login and receive JWT token containing role information
2. **Authorization**: Each endpoint checks user role against required permissions
3. **Role Enforcement**: `RolesGuard` validates user role matches endpoint requirements

## Role-Protected Endpoints

### Admin-Only Endpoints

#### User Management

- `POST /auth/register-admin` - Create admin users
- `GET /user/all` - View all users in system
- `GET /user/:id` - View specific user details
- `PATCH /user/:id/role` - Update user roles

#### System Monitoring

- `GET /accounts/admin/all` - View all accounts in system
- `GET /transactions/admin/all` - View all transactions in system

### Mixed Access Endpoints

Most endpoints allow both USER and ADMIN roles, but with different access levels:

- **Users** can only access their own resources
- **Admins** have system-wide access

## Implementation Details

### JWT Payload Structure

```typescript
{
  sub: number,      // User ID
  email: string,    // User email
  role: Role,       // USER or ADMIN
  iat: number,      // Issued at
  exp: number       // Expires at
}
```

### Role Guard Implementation

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No role requirement
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### Usage in Controllers

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Get('admin/all')
async getAllUsers(): Promise<UserResponseDto[]> {
  return this.userService.findAll();
}
```

## Security Considerations

1. **Role Verification**: All role-protected endpoints verify JWT token validity and role claims
2. **Resource Isolation**: Users can only access their own resources unless they have admin privileges
3. **Principle of Least Privilege**: Users receive minimal necessary permissions
4. **Admin Creation**: Only existing admins can create new admin users

## Testing Admin Features

### Default Admin Account

The seeded database includes a default admin account:

- **Email**: `admin.revobank@gmail.com`
- **Password**: `password123`
- **Role**: `ADMIN`

### Creating Additional Admins

1. Login as existing admin
2. Use `POST /auth/register-admin` with admin JWT token
3. Set role in request body: `{"role": "ADMIN"}`

## Error Responses

### Insufficient Permissions

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### Invalid Token

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## Migration from Previous Version

If upgrading from a version without roles:

1. Run database migration: `npx prisma migrate dev --name add-user-role`
2. Existing users will default to USER role
3. Manually promote users to ADMIN as needed using admin endpoints

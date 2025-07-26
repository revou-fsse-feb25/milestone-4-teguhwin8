# Revo Bank Backend API

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.12.0-purple.svg)](https://prisma.io)

A modern, secure, and scalable banking backend API built with NestJS, TypeScript, and Prisma ORM. This project provides comprehensive user authentication, profile management, and banking operations with enterprise-grade security features.

## 🏦 Project Overview

Revo Bank Backend is a RESTful API designed for modern banking applications. It features JWT-based authentication, secure password handling, comprehensive user management, and a foundation for banking operations including accounts and transactions.

### 🎯 Key Features

- **🔐 JWT Authentication** - Secure token-based authentication system
- **👤 User Management** - Complete CRUD operations for user profiles
- **🛡️ Security First** - Password hashing, input validation, and route protection
- **📊 Database Integration** - PostgreSQL with Prisma ORM
- **🧪 Testing Ready** - Comprehensive unit and integration tests
- **📖 API Documentation** - OpenAPI/Swagger integration
- **🚀 Production Ready** - Environment configuration and deployment ready

## 🏗️ Architecture

Built with modern backend architecture principles:

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [API Documentation](#-api-documentation)
- [Database Setup](#-database-setup)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.0.0
- npm or yarn
- PostgreSQL database
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/revou-fsse-feb25/milestone-4-teguhwin8.git
cd milestone-4-teguhwin8

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Seed database with dummy data (Indonesian users & Rupiah amounts)
npx prisma db seed

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3000`

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/revobank"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
PORT=3000
NODE_ENV="development"
```

### Environment Variables

| Variable         | Description                  | Required | Default       |
| ---------------- | ---------------------------- | -------- | ------------- |
| `DATABASE_URL`   | PostgreSQL connection string | ✅       | -             |
| `JWT_SECRET`     | JWT signing secret           | ✅       | -             |
| `JWT_EXPIRES_IN` | Token expiration time        | ❌       | `7d`          |
| `PORT`           | Server port                  | ❌       | `3000`        |
| `NODE_ENV`       | Environment mode             | ❌       | `development` |

## 📖 API Documentation

### Live Documentation

- **Swagger UI**: `http://localhost:3000/api` (when server is running)
- **API Docs**: [docs/api/README.md](docs/api/README.md)

### Available Endpoints

| Method   | Endpoint                 | Description               | Auth Required |
| -------- | ------------------------ | ------------------------- | ------------- |
| `GET`    | `/`                      | Health check              | ❌            |
| `POST`   | `/auth/register`         | User registration         | ❌            |
| `POST`   | `/auth/login`            | User login                | ❌            |
| `GET`    | `/user/profile`          | Get user profile          | ✅            |
| `PATCH`  | `/user/profile`          | Update user profile       | ✅            |
| `DELETE` | `/user/profile`          | Delete user account       | ✅            |
| `POST`   | `/accounts`              | Create new account        | ✅            |
| `GET`    | `/accounts`              | Get all user accounts     | ✅            |
| `GET`    | `/accounts/:id`          | Get account by ID         | ✅            |
| `DELETE` | `/accounts/:id`          | Delete account            | ✅            |
| `POST`   | `/transactions/deposit`  | Deposit money (IDR)       | ✅            |
| `POST`   | `/transactions/withdraw` | Withdraw money (IDR)      | ✅            |
| `POST`   | `/transactions/transfer` | Transfer money (IDR)      | ✅            |
| `GET`    | `/transactions`          | Get all user transactions | ✅            |
| `GET`    | `/transactions/:id`      | Get transaction by ID     | ✅            |

### Quick API Test

```bash
# Health check
curl http://localhost:3000/

# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"budi.santoso@gmail.com","password":"password123","name":"Budi Santoso"}'

# Login with seeded user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"budi.santoso@gmail.com","password":"password123"}'

# Create account (need JWT token from login)
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{}'

# Deposit money (Rp 500,000)
curl -X POST http://localhost:3000/transactions/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"accountId":1,"amount":500000}'
```

### 🇮🇩 Test Credentials (Seeded Data)

After running `npx prisma db seed`, you can use these Indonesian test accounts:

| Email                      | Password      | Name           | Account Balance (IDR)       |
| -------------------------- | ------------- | -------------- | --------------------------- |
| `budi.santoso@gmail.com`   | `password123` | Budi Santoso   | Rp 5.000.000 + Rp 1.500.000 |
| `sari.wijaya@gmail.com`    | `password123` | Sari Wijaya    | Rp 3.250.000                |
| `agus.pratama@gmail.com`   | `password123` | Agus Pratama   | Rp 8.750.000                |
| `admin.revobank@gmail.com` | `password123` | Admin RevoBank | Rp 50.000.000               |

## 🗄️ Database Setup

### Using PostgreSQL

1. **Install PostgreSQL** (if not already installed)
2. **Create Database**:
   ```sql
   CREATE DATABASE revobank;
   CREATE USER revouser WITH ENCRYPTED PASSWORD 'revopass';
   GRANT ALL PRIVILEGES ON DATABASE revobank TO revouser;
   ```
3. **Update DATABASE_URL** in `.env`
4. **Run Migrations & Seed**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

### Database Schema

Current schema includes:

- **Users** - User account information with Indonesian test data
- **Accounts** - Bank account details with Rupiah balances
- **Transactions** - Transaction history with Indonesian currency amounts

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema definition.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Test Coverage

Current modules with comprehensive testing:

- ✅ **User Module** - 95%+ coverage
- ✅ **Auth Module** - 95%+ coverage
- 🔄 **Account Module** - Coming soon
- 🔄 **Transaction Module** - Coming soon

### Testing Tools

For manual API testing, we provide:

- **Postman Collection** - [postman/Revo-Bank-API.postman_collection.json](postman/Revo-Bank-API.postman_collection.json)
- **cURL Commands** - [docs/testing/curl-commands.md](docs/testing/curl-commands.md)
- **Testing Guide** - [docs/testing/README.md](docs/testing/README.md)

#### 🚨 Important: Testing Transaction Endpoints

When testing **Transaction endpoints** (Deposit, Withdraw, Transfer), the Postman collection automatically detects your valid account IDs:

1. **For Transfer Money**: You need **at least 2 accounts** to test transfers
   - The collection will use your first account as source (`fromAccountId`)
   - The collection will use your second account as destination (`toAccountId`)
   - If you only have 1 account, create another account first

2. **For Deposit/Withdraw**: The collection will use your first account automatically

3. **Steps to test successfully**:

   ```
   1. Run "Register" or use seeded user credentials
   2. Run "Login" to get access token
   3. Run "Create Account" at least twice (for transfer testing)
   4. Run any Transaction endpoint - account IDs will be auto-detected
   ```

4. **If you get "not your userid" error**: This means you're using hardcoded account IDs that don't belong to your user. The updated collection fixes this by auto-detecting your valid account IDs.

## 📁 Project Structure

```
revo-bank-backend/
├── docs/                          # 📖 Documentation
│   ├── api/                       # API documentation
│   ├── modules/                   # Module-specific docs
│   └── testing/                   # Testing guides
├── postman/                       # 🧪 API testing collections
├── prisma/                        # 🗄️ Database schema & migrations
├── src/                           # 💻 Source code
│   ├── auth/                      # 🔐 Authentication module
│   ├── user/                      # 👤 User management module
│   ├── account/                   # 🏦 Account module (coming soon)
│   ├── transaction/               # 💸 Transaction module (coming soon)
│   ├── app.module.ts              # Main application module
│   └── main.ts                    # Application entry point
├── test/                          # 🧪 E2E tests
├── .env.example                   # Environment template
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Run database migrations
npx prisma db seed         # Seed database with Indonesian dummy data
npx prisma studio          # Open Prisma Studio

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm test                   # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Test coverage report
```

### Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow TypeScript best practices
   - Add tests for new features
   - Update documentation

3. **Test Changes**

   ```bash
   npm test
   npm run test:e2e
   npm run lint
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Common Issues & Troubleshooting

#### ❌ `{ userId: undefined }` in Transaction Service

**Penyebab**: Inconsistent user ID extraction pattern between controllers

**Solusi**: Pastikan semua controllers menggunakan pattern yang sama:

```typescript
// ✅ BENAR - Gunakan @Request() dan req.user.id
@Post('endpoint')
async someMethod(@Request() req, @Body() dto: SomeDto) {
  return this.service.someMethod(req.user.id, dto);
}

// ❌ SALAH - Jangan gunakan @User('sub')
@Post('endpoint')
async someMethod(@User('sub') userId: number, @Body() dto: SomeDto) {
  // userId akan undefined karena JWT strategy mengembalikan user object, bukan payload
}
```

#### ❌ "not your userid" Error in Transactions

**Penyebab**: Hardcoded account IDs dalam testing yang bukan milik user

**Solusi**:

1. Gunakan Postman collection yang sudah updated (auto-detect account IDs)
2. Atau pastikan account ID yang digunakan benar-benar milik user yang login

#### ❌ JWT Token Expired

**Penyebab**: Token expired atau tidak valid

**Solusi**: Login ulang untuk mendapatkan token baru

## 🚀 Deployment

### Build for Production

```bash
# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start production server
npm run start:prod
```

### Deployment Platforms

Ready for deployment on:

- **Railway** - One-click deployment
- **Render** - Automatic builds from Git
- **Fly.io** - Global deployment
- **Heroku** - Traditional PaaS
- **AWS/GCP/Azure** - Cloud platforms

### Environment Variables for Production

Ensure these are set in your production environment:

- `DATABASE_URL` - Production database connection
- `JWT_SECRET` - Strong, unique secret key
- `NODE_ENV=production`
- `PORT` (if required by platform)

## 📚 Documentation

### Detailed Documentation

- **[API Reference](docs/api/README.md)** - Complete API documentation
- **[User Module](docs/modules/user-module.md)** - User management features
- **[Auth Module](docs/modules/auth-module.md)** - Authentication system
- **[Testing Guide](docs/testing/README.md)** - How to test the API
- **[Database Schema](docs/api/database-schema.md)** - Database design

### Module Documentation

Each module includes:

- Feature overview
- API endpoints
- Request/response examples
- Error handling
- Testing examples

## 🔒 Security Features

- **🔐 JWT Authentication** - Secure token-based auth
- **🛡️ Password Hashing** - bcrypt with salt rounds
- **✅ Input Validation** - class-validator for all inputs
- **🚫 Route Protection** - Global authentication guards
- **🔒 CORS Configuration** - Cross-origin request security
- **📝 Request Logging** - Comprehensive request tracking

## 🎯 Roadmap

### ✅ Completed (Phase 1-2)

- [x] Project setup & configuration
- [x] User authentication system
- [x] User profile management
- [x] JWT token implementation
- [x] Comprehensive testing
- [x] API documentation

### 🔄 In Progress (Phase 3-4)

- [ ] Account management module
- [ ] Transaction processing
- [ ] Account balance tracking
- [ ] Transaction history

### 📋 Planned (Phase 5-8)

- [ ] Advanced testing & validation
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Monitoring & logging

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**
3. **Follow coding standards**
4. **Add tests for new features**
5. **Update documentation**
6. **Submit a pull request**

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Airbnb configuration
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Teguh Widodo](https://github.com/teguhwin8)
- **Institution**: RevoU Full Stack Software Engineering

## 🙏 Acknowledgments

- **NestJS Team** - Amazing framework
- **Prisma Team** - Excellent ORM
- **RevoU** - Educational support
- **Community** - Open source contributions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/revou-fsse-feb25/milestone-4-teguhwin8/issues)
- **Documentation**: [docs/](docs/)
- **API Testing**: [postman/](postman/)

---

Made with ❤️ for modern banking applications

# Revo Bank Backend

### 🎯 Key Features

- **🔐 JWT Authentication** - Token-based auth system
- **👤 User Management** - CRUD for user profiles
- **🛡️ Role-Based Access** - USER & ADMIN roles
- **🏦 Account Management** - Multiple accounts per user
- **💸 Transaction System** - Deposit, withdraw, transfer (in IDR)
- **🔒 Security** - Password hashing, input validation
- **📊 PostgreSQL + Prisma** - Modern DB stack
- **🧪 Testing Ready** - Unit test setup
- **📖 API Docs** - Swagger/OpenAPI

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.12.0-purple.svg)](https://prisma.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern banking backend API built with NestJS, TypeScript, and Prisma ORM, focused on the Indonesian market with Rupiah-based operations.

---

## Project Overview

Revo Bank Backend is a RESTful API for banking apps with full authentication, user management, and IDR-based transactions, secured and ready for production.

---

## Architecture

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + Passport
- **Validation**: class-validator
- **Testing**: Jest
- **Docs**: Swagger/OpenAPI

---

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)

---

## Quick Start

```bash
# Clone & install
$ git clone https://github.com/revou-fsse-feb25/milestone-4-teguhwin8.git
$ cd milestone-4-teguhwin8
$ npm install

# Setup env
$ cp .env.example .env

# Migrate & seed DB
$ npx prisma generate
$ npx prisma migrate dev --name init
$ npx prisma db seed

# Start dev server
$ npm run start:dev
```

API base URL: `http://localhost:3000`

---

## Environment Setup

```env
DATABASE_URL="postgresql://username:password@localhost:5432/revobank"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

---

## API Documentation

- Swagger decorators ✅
- Swagger UI setup 🔄 (to be configured in `main.ts`)
- Manual docs: [`docs/api/README.md`](./docs/api/README.md)
- Postman collection: [`postman/Revo-Bank-API.postman_collection.json`](./postman/Revo-Bank-API.postman_collection.json)

### 🔓 Public Endpoints

| Method | Endpoint         | Description  |
| ------ | ---------------- | ------------ |
| GET    | `/`              | Health check |
| POST   | `/auth/register` | Register     |
| POST   | `/auth/login`    | Login        |

### 👤 User Endpoints (Auth required)

| Method | Endpoint        | Description    | Role       |
| ------ | --------------- | -------------- | ---------- |
| GET    | `/user/profile` | Get profile    | USER/ADMIN |
| PATCH  | `/user/profile` | Update profile | USER/ADMIN |
| DELETE | `/user/profile` | Delete account | USER/ADMIN |

### 👑 Admin Endpoints (ADMIN only)

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | `/auth/register-admin` | Register admin   |
| GET    | `/user/all`            | Get all users    |
| GET    | `/user/:id`            | Get user by ID   |
| PATCH  | `/user/:id/role`       | Change user role |

### 🏦 Account Endpoints

| Method | Endpoint              | Description       | Role       |
| ------ | --------------------- | ----------------- | ---------- |
| POST   | `/accounts`           | Create account    | USER/ADMIN |
| GET    | `/accounts`           | Get user accounts | USER/ADMIN |
| GET    | `/accounts/admin/all` | Get all accounts  | ADMIN      |
| GET    | `/accounts/:id`       | Get account by ID | USER/ADMIN |
| DELETE | `/accounts/:id`       | Delete account    | USER/ADMIN |

### 💸 Transaction Endpoints

| Method | Endpoint                  | Description           | Role       |
| ------ | ------------------------- | --------------------- | ---------- |
| POST   | `/transactions/deposit`   | Deposit IDR           | USER/ADMIN |
| POST   | `/transactions/withdraw`  | Withdraw IDR          | USER/ADMIN |
| POST   | `/transactions/transfer`  | Transfer IDR          | USER/ADMIN |
| GET    | `/transactions`           | User transaction logs | USER/ADMIN |
| GET    | `/transactions/admin/all` | All transactions      | ADMIN      |
| GET    | `/transactions/:id`       | Get transaction by ID | USER/ADMIN |

---

## Testing

```bash
npm test            # run unit tests
npm run test:e2e    # run e2e tests
npm run test:watch  # watch mode
npm run test:cov    # coverage
```

Testing guides:

- [cURL Commands](./docs/testing/curl-commands.md)
- [Postman Setup](./postman/Revo-Bank-API.postman_collection.json)
- [Testing Guide](./docs/testing/README.md)

---

## Database Setup

```sql
CREATE DATABASE revobank;
CREATE USER revouser WITH PASSWORD 'revopass';
GRANT ALL PRIVILEGES ON DATABASE revobank TO revouser;
```

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

See full schema: [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## Project Structure

```bash
src/
├── auth/
├── user/
├── account/
├── transaction/
├── prisma/
├── main.ts
├── app.module.ts
```

For detailed module docs:

- [Auth Module](./docs/modules/auth-module.md)
- [User Module](./docs/modules/user-module.md)
- [RBAC Rules](./docs/api/rbac-documentation.md)

---

## Deployment

```bash
npm ci --only=production
npx prisma generate
npm run build
npx prisma migrate deploy
npm run start:prod
```

Supports:

- Railway
- Render
- Fly.io
- Heroku
- AWS/GCP/Azure

---

## Contributing

1. Fork & clone
2. Create branch: `git checkout -b feat/your-feature`
3. Follow code style: ESLint, Prettier, Conventional Commits
4. Commit, push, and PR to `main`

---

## License

MIT License. See [`LICENSE`](./LICENSE).

---

## Team

- **Developer**: [Teguh Widodo](https://teguhcoding.com)
- **Institution**: RevoU Full Stack Software Engineering

---

Made with ❤️ for modern Indonesian banking solutions.

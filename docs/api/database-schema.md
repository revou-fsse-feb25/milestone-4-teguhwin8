# Database Schema Documentation

## Overview

The Revo Bank database uses PostgreSQL with Prisma ORM for type-safe database operations. The schema is designed for a banking application with users, accounts, and transactions.

## Database Configuration

### Connection Settings

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/revobank"
```

### Prisma Configuration

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Schema Overview

The database consists of three main entities:

- **Users** - Application users and authentication
- **Accounts** - Bank accounts belonging to users
- **Transactions** - Financial transactions between accounts

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │ 1   N │   Account   │ 1   N │ Transaction │
│             │ ────▶ │             │ ────▶ │             │
│ - id        │       │ - id        │       │ - id        │
│ - email     │       │ - userId    │       │ - accountId │
│ - password  │       │ - balance   │       │ - type      │
│ - name      │       │ - createdAt │       │ - amount    │
│ - createdAt │       │             │       │ - createdAt │
└─────────────┘       └─────────────┘       └─────────────┘
```

## Tables

### Users Table

Stores user authentication and profile information.

```sql
CREATE TABLE "User" (
  id        SERIAL PRIMARY KEY,
  email     VARCHAR(255) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  name      VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Prisma Schema:**

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String
  accounts  Account[]
  createdAt DateTime  @default(now())
}
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Int | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| `email` | String | UNIQUE, NOT NULL | User email address |
| `password` | String | NOT NULL | Hashed password (bcrypt) |
| `name` | String | NOT NULL | User full name |
| `createdAt` | DateTime | DEFAULT now() | Account creation timestamp |

**Indexes:**

- Primary key on `id`
- Unique index on `email`

**Relationships:**

- **One-to-Many** with `Account` (users can have multiple accounts)

---

### Accounts Table

Stores bank account information for users.

```sql
CREATE TABLE "Account" (
  id           SERIAL PRIMARY KEY,
  "userId"     INTEGER NOT NULL REFERENCES "User"(id),
  balance      DECIMAL(10,2) DEFAULT 0.00,
  CONSTRAINT fk_account_user FOREIGN KEY ("userId") REFERENCES "User"(id)
);
```

**Prisma Schema:**

```prisma
model Account {
  id           Int           @id @default(autoincrement())
  user         User          @relation(fields: [userId], references: [id])
  userId       Int
  balance      Float         @default(0)
  transactions Transaction[]
}
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Int | PRIMARY KEY, AUTO INCREMENT | Unique account identifier |
| `userId` | Int | FOREIGN KEY, NOT NULL | Reference to User.id |
| `balance` | Float | DEFAULT 0 | Current account balance |

**Indexes:**

- Primary key on `id`
- Foreign key index on `userId`

**Relationships:**

- **Many-to-One** with `User` (account belongs to one user)
- **One-to-Many** with `Transaction` (account can have multiple transactions)

---

### Transactions Table

Stores financial transaction records.

```sql
CREATE TABLE "Transaction" (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(50) NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,
  "accountId" INTEGER NOT NULL REFERENCES "Account"(id),
  createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transaction_account FOREIGN KEY ("accountId") REFERENCES "Account"(id)
);
```

**Prisma Schema:**

```prisma
model Transaction {
  id        Int      @id @default(autoincrement())
  type      String
  amount    Float
  account   Account  @relation(fields: [accountId], references: [id])
  accountId Int
  createdAt DateTime @default(now())
}
```

**Fields:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Int | PRIMARY KEY, AUTO INCREMENT | Unique transaction identifier |
| `type` | String | NOT NULL | Transaction type (deposit, withdraw, transfer) |
| `amount` | Float | NOT NULL | Transaction amount |
| `accountId` | Int | FOREIGN KEY, NOT NULL | Reference to Account.id |
| `createdAt` | DateTime | DEFAULT now() | Transaction timestamp |

**Transaction Types:**

- `deposit` - Money added to account
- `withdraw` - Money removed from account
- `transfer_in` - Money received from another account
- `transfer_out` - Money sent to another account

**Indexes:**

- Primary key on `id`
- Foreign key index on `accountId`
- Index on `createdAt` for performance

**Relationships:**

- **Many-to-One** with `Account` (transaction belongs to one account)

## Database Operations

### Common Queries

#### User Operations

```typescript
// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: 'hashedPassword',
    name: 'John Doe',
  },
});

// Find user with accounts
const userWithAccounts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    accounts: {
      include: {
        transactions: true,
      },
    },
  },
});
```

#### Account Operations

```typescript
// Create account for user
const account = await prisma.account.create({
  data: {
    userId: 1,
    balance: 1000.0,
  },
});

// Update account balance
const updatedAccount = await prisma.account.update({
  where: { id: 1 },
  data: { balance: 1500.0 },
});
```

#### Transaction Operations

```typescript
// Create transaction
const transaction = await prisma.transaction.create({
  data: {
    type: 'deposit',
    amount: 500.0,
    accountId: 1,
  },
});

// Get account transactions
const transactions = await prisma.transaction.findMany({
  where: { accountId: 1 },
  orderBy: { createdAt: 'desc' },
});
```

### Migrations

#### Initial Migration

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

## Data Constraints & Validation

### Business Rules

1. **Email Uniqueness**: Each user must have a unique email address
2. **Positive Balances**: Account balances cannot go negative (to be enforced)
3. **Transaction Amounts**: Must be positive numbers
4. **User-Account Relationship**: Users can have multiple accounts
5. **Account-Transaction Relationship**: Transactions must belong to valid accounts

### Database Constraints

```sql
-- Email uniqueness
ALTER TABLE "User" ADD CONSTRAINT "unique_email" UNIQUE ("email");

-- Positive amounts (to be added)
ALTER TABLE "Transaction" ADD CONSTRAINT "positive_amount" CHECK ("amount" > 0);

-- Valid transaction types (to be added)
ALTER TABLE "Transaction" ADD CONSTRAINT "valid_type"
  CHECK ("type" IN ('deposit', 'withdraw', 'transfer_in', 'transfer_out'));

-- Positive balance (to be added)
ALTER TABLE "Account" ADD CONSTRAINT "positive_balance" CHECK ("balance" >= 0);
```

## Performance Considerations

### Indexing Strategy

```sql
-- User table
CREATE INDEX idx_user_email ON "User"("email");
CREATE INDEX idx_user_created ON "User"("createdAt");

-- Account table
CREATE INDEX idx_account_user ON "Account"("userId");
CREATE INDEX idx_account_balance ON "Account"("balance");

-- Transaction table
CREATE INDEX idx_transaction_account ON "Transaction"("accountId");
CREATE INDEX idx_transaction_created ON "Transaction"("createdAt");
CREATE INDEX idx_transaction_type ON "Transaction"("type");
CREATE INDEX idx_transaction_amount ON "Transaction"("amount");
```

### Query Optimization

- Use `include` judiciously to avoid N+1 queries
- Implement pagination for transaction listings
- Consider aggregation queries for balance calculations
- Use database-level constraints for data integrity

## Backup and Recovery

### Backup Strategy

```bash
# Full database backup
pg_dump -h localhost -p 5432 -U revouser -d revobank > backup.sql

# Schema-only backup
pg_dump -h localhost -p 5432 -U revouser -d revobank --schema-only > schema.sql

# Data-only backup
pg_dump -h localhost -p 5432 -U revouser -d revobank --data-only > data.sql
```

### Restore

```bash
# Restore from backup
psql -h localhost -p 5432 -U revouser -d revobank < backup.sql
```

## Security Considerations

### Data Protection

- **Password Hashing**: All passwords stored using bcrypt
- **Email Validation**: Server-side validation for email format
- **SQL Injection**: Prisma ORM provides automatic protection
- **Data Access**: Row-level security through application logic

### Auditing (Future Enhancement)

Consider adding audit columns:

```prisma
model User {
  // ... existing fields
  updatedAt DateTime @updatedAt
  updatedBy Int?
  version   Int     @default(1)
}
```

## Development Commands

```bash
# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev --name your_migration_name

# Deploy migrations to production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

## Production Considerations

### Connection Pooling

```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Environment Variables

```bash
# Production
DATABASE_URL="postgresql://user:password@prod-host:5432/revobank?connection_limit=10&pool_timeout=20"

# SSL Configuration for production
DATABASE_URL="postgresql://user:password@prod-host:5432/revobank?sslmode=require"
```

This schema provides a solid foundation for a banking application with room for future enhancements and scaling.

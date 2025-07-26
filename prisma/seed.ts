import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for dummy users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create dummy users
  console.log('👥 Creating dummy users...');

  const user1 = await prisma.user.create({
    data: {
      email: 'budi.santoso@gmail.com',
      password: hashedPassword,
      name: 'Budi Santoso',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sari.wijaya@gmail.com',
      password: hashedPassword,
      name: 'Sari Wijaya',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'agus.pratama@gmail.com',
      password: hashedPassword,
      name: 'Agus Pratama',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin.revobank@gmail.com',
      password: hashedPassword,
      name: 'Admin RevoBank',
    },
  });

  console.log(`✅ Created ${4} users`);

  // Create dummy accounts
  console.log('🏦 Creating dummy accounts...');

  const account1 = await prisma.account.create({
    data: {
      userId: user1.id,
      balance: 5000000.0,
    },
  });

  const account2 = await prisma.account.create({
    data: {
      userId: user1.id,
      balance: 1500000.0,
    },
  });

  const account3 = await prisma.account.create({
    data: {
      userId: user2.id,
      balance: 3250000.0,
    },
  });

  const account4 = await prisma.account.create({
    data: {
      userId: user3.id,
      balance: 8750000.0,
    },
  });

  const adminAccount = await prisma.account.create({
    data: {
      userId: adminUser.id,
      balance: 50000000.0,
    },
  });

  console.log(`✅ Created ${5} accounts`);

  // Create dummy transactions
  console.log('💸 Creating dummy transactions...');

  const transactions = [
    // User 1 Account 1 transactions
    {
      type: 'DEPOSIT',
      amount: 1000000.0,
      accountId: account1.id,
    },
    {
      type: 'WITHDRAWAL',
      amount: 250000.0,
      accountId: account1.id,
    },
    {
      type: 'TRANSFER_OUT',
      amount: 500000.0,
      accountId: account1.id,
    },

    // User 1 Account 2 transactions
    {
      type: 'DEPOSIT',
      amount: 2000000.0,
      accountId: account2.id,
    },
    {
      type: 'TRANSFER_IN',
      amount: 500000.0,
      accountId: account2.id,
    },

    // User 2 Account transactions
    {
      type: 'DEPOSIT',
      amount: 3000000.0,
      accountId: account3.id,
    },
    {
      type: 'WITHDRAWAL',
      amount: 150000.0,
      accountId: account3.id,
    },
    {
      type: 'DEPOSIT',
      amount: 400000.0,
      accountId: account3.id,
    },

    // User 3 Account transactions
    {
      type: 'DEPOSIT',
      amount: 5000000.0,
      accountId: account4.id,
    },
    {
      type: 'DEPOSIT',
      amount: 2500000.0,
      accountId: account4.id,
    },
    {
      type: 'WITHDRAWAL',
      amount: 750000.0,
      accountId: account4.id,
    },
    {
      type: 'TRANSFER_OUT',
      amount: 1000000.0,
      accountId: account4.id,
    },

    // Admin Account transactions
    {
      type: 'DEPOSIT',
      amount: 50000000.0,
      accountId: adminAccount.id,
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log(`✅ Created ${transactions.length} transactions`);

  // Summary
  console.log('\n📊 Seeding Summary:');
  console.log('==================');

  const userCount = await prisma.user.count();
  const accountCount = await prisma.account.count();
  const transactionCount = await prisma.transaction.count();

  console.log(`👥 Users: ${userCount}`);
  console.log(`🏦 Accounts: ${accountCount}`);
  console.log(`💸 Transactions: ${transactionCount}`);

  console.log('\n🔑 Test Credentials:');
  console.log('===================');
  console.log('Email: budi.santoso@gmail.com');
  console.log('Email: sari.wijaya@gmail.com');
  console.log('Email: agus.pratama@gmail.com');
  console.log('Email: admin.revobank@gmail.com');
  console.log('Password: password123 (for all users)');

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: number, depositDto: DepositDto) {
    // Verify account ownership
    const account = await this.prisma.account.findUnique({
      where: { id: depositDto.accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You can only deposit to your own accounts');
    }

    // Perform deposit transaction
    const [transaction, updatedAccount] = await this.prisma.$transaction([
      // Create transaction record
      this.prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount: depositDto.amount,
          accountId: depositDto.accountId,
        },
        include: {
          account: {
            select: {
              id: true,
              balance: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      // Update account balance
      this.prisma.account.update({
        where: { id: depositDto.accountId },
        data: {
          balance: {
            increment: depositDto.amount,
          },
        },
      }),
    ]);

    return transaction;
  }

  async withdraw(userId: number, withdrawDto: WithdrawDto) {
    // Verify account ownership
    const account = await this.prisma.account.findUnique({
      where: { id: withdrawDto.accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException(
        'You can only withdraw from your own accounts',
      );
    }

    // Check sufficient balance
    if (account.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Perform withdrawal transaction
    const [transaction, updatedAccount] = await this.prisma.$transaction([
      // Create transaction record
      this.prisma.transaction.create({
        data: {
          type: 'WITHDRAWAL',
          amount: withdrawDto.amount,
          accountId: withdrawDto.accountId,
        },
        include: {
          account: {
            select: {
              id: true,
              balance: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      // Update account balance
      this.prisma.account.update({
        where: { id: withdrawDto.accountId },
        data: {
          balance: {
            decrement: withdrawDto.amount,
          },
        },
      }),
    ]);

    return transaction;
  }

  async transfer(userId: number, transferDto: TransferDto) {
    // Verify both accounts exist
    const [fromAccount, toAccount] = await Promise.all([
      this.prisma.account.findUnique({
        where: { id: transferDto.fromAccountId },
      }),
      this.prisma.account.findUnique({
        where: { id: transferDto.toAccountId },
      }),
    ]);

    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }

    // Verify source account ownership
    if (fromAccount.userId !== userId) {
      throw new ForbiddenException(
        'You can only transfer from your own accounts',
      );
    }

    // Prevent self-transfer
    if (transferDto.fromAccountId === transferDto.toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    // Check sufficient balance
    if (fromAccount.balance < transferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Perform transfer transaction
    const [transferOutTransaction, transferInTransaction] =
      await this.prisma.$transaction([
        // Create TRANSFER_OUT transaction
        this.prisma.transaction.create({
          data: {
            type: 'TRANSFER_OUT',
            amount: transferDto.amount,
            accountId: transferDto.fromAccountId,
          },
          include: {
            account: {
              select: {
                id: true,
                balance: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),
        // Create TRANSFER_IN transaction
        this.prisma.transaction.create({
          data: {
            type: 'TRANSFER_IN',
            amount: transferDto.amount,
            accountId: transferDto.toAccountId,
          },
          include: {
            account: {
              select: {
                id: true,
                balance: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),
        // Update source account balance
        this.prisma.account.update({
          where: { id: transferDto.fromAccountId },
          data: {
            balance: {
              decrement: transferDto.amount,
            },
          },
        }),
        // Update destination account balance
        this.prisma.account.update({
          where: { id: transferDto.toAccountId },
          data: {
            balance: {
              increment: transferDto.amount,
            },
          },
        }),
      ]);

    return {
      transferOut: transferOutTransaction,
      transferIn: transferInTransaction,
    };
  }

  async findAll(userId: number) {
    // Get all user's accounts first
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = userAccounts.map((account) => account.id);

    // Get all transactions for user's accounts
    return this.prisma.transaction.findMany({
      where: {
        accountId: {
          in: accountIds,
        },
      },
      include: {
        account: {
          select: {
            id: true,
            balance: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: number, transactionId: number) {
    // Get all user's accounts first
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = userAccounts.map((account) => account.id);

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        account: {
          select: {
            id: true,
            balance: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Verify user owns the account involved in this transaction
    if (!accountIds.includes(transaction.accountId)) {
      throw new ForbiddenException('You can only access your own transactions');
    }

    return transaction;
  }
}

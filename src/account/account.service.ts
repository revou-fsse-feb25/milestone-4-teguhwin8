import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    try {
      const account = await this.prisma.account.create({
        data: {
          userId,
          balance: createAccountDto.balance,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return new AccountResponseDto(account);
    } catch (error) {
      throw new BadRequestException('Failed to create account');
    }
  }

  async findAllByUser(userId: number): Promise<AccountResponseDto[]> {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transactions: {
          select: {
            id: true,
            type: true,
            amount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Show last 5 transactions
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return accounts.map((account) => new AccountResponseDto(account));
  }

  async findOne(id: number, userId: number): Promise<AccountResponseDto> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transactions: {
          select: {
            id: true,
            type: true,
            amount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Show last 10 transactions for detailed view
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if user owns this account
    if (account.userId !== userId) {
      throw new ForbiddenException('You can only access your own accounts');
    }

    return new AccountResponseDto(account);
  }

  async update(
    id: number,
    userId: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    // Check if account exists and belongs to user
    const existingAccount = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      throw new NotFoundException('Account not found');
    }

    if (existingAccount.userId !== userId) {
      throw new ForbiddenException('You can only update your own accounts');
    }

    // Update account
    try {
      const account = await this.prisma.account.update({
        where: { id },
        data: updateAccountDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return new AccountResponseDto(account);
    } catch (error) {
      throw new BadRequestException('Failed to update account');
    }
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    // Check if account exists and belongs to user
    const existingAccount = await this.prisma.account.findUnique({
      where: { id },
      include: {
        transactions: true,
      },
    });

    if (!existingAccount) {
      throw new NotFoundException('Account not found');
    }

    if (existingAccount.userId !== userId) {
      throw new ForbiddenException('You can only delete your own accounts');
    }

    // Check if account has transactions
    if (existingAccount.transactions.length > 0) {
      throw new BadRequestException(
        'Cannot delete account with existing transactions',
      );
    }

    // Check if account has balance
    if (existingAccount.balance > 0) {
      throw new BadRequestException(
        'Cannot delete account with positive balance. Please withdraw all funds first.',
      );
    }

    // Delete account
    try {
      await this.prisma.account.delete({
        where: { id },
      });

      return { message: 'Account deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete account');
    }
  }

  async getAccountBalance(
    id: number,
    userId: number,
  ): Promise<{ balance: number }> {
    const account = await this.findOne(id, userId);
    return { balance: account.balance };
  }

  // Helper method for internal use (e.g., by transaction service)
  async findAccountById(id: number): Promise<any> {
    return await this.prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  // Helper method to update balance (for transactions)
  async updateBalance(id: number, newBalance: number): Promise<void> {
    await this.prisma.account.update({
      where: { id },
      data: { balance: newBalance },
    });
  }
}

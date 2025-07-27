import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

// Mock PrismaClient
const mockPrismaService = {
  account: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an account successfully', async () => {
      const userId = 1;
      const createAccountDto = { balance: 1000 };
      const mockAccount = {
        id: 1,
        userId,
        balance: 1000,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockPrismaService.account.create.mockResolvedValue(mockAccount);

      const result = await service.create(userId, createAccountDto);

      expect(mockPrismaService.account.create).toHaveBeenCalledWith({
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

      expect(result).toBeDefined();
      expect(result.id).toBe(mockAccount.id);
      expect(result.balance).toBe(mockAccount.balance);
    });

    it('should throw BadRequestException when creation fails', async () => {
      const userId = 1;
      const createAccountDto = { balance: 1000 };

      mockPrismaService.account.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(userId, createAccountDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllByUser', () => {
    it('should return all accounts for a user', async () => {
      const userId = 1;
      const mockAccounts = [
        {
          id: 1,
          userId,
          balance: 1000,
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
          transactions: [],
        },
        {
          id: 2,
          userId,
          balance: 2000,
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
          transactions: [],
        },
      ];

      mockPrismaService.account.findMany.mockResolvedValue(mockAccounts);

      const result = await service.findAllByUser(userId);

      expect(mockPrismaService.account.findMany).toHaveBeenCalledWith({
        where: { userId },
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
            take: 5,
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return an account when it exists and belongs to user', async () => {
      const accountId = 1;
      const userId = 1;
      const mockAccount = {
        id: accountId,
        userId,
        balance: 1000,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
        transactions: [],
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      const result = await service.findOne(accountId, userId);

      expect(result).toBeDefined();
      expect(result.id).toBe(accountId);
      expect(result.userId).toBe(userId);
    });

    it('should throw NotFoundException when account does not exist', async () => {
      const accountId = 999;
      const userId = 1;

      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.findOne(accountId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when account belongs to another user', async () => {
      const accountId = 1;
      const userId = 1;
      const mockAccount = {
        id: accountId,
        userId: 2, // Different user
        balance: 1000,
        user: {
          id: 2,
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
        transactions: [],
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.findOne(accountId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update an account successfully', async () => {
      const accountId = 1;
      const userId = 1;
      const updateAccountDto = { balance: 2000 };

      const existingAccount = {
        id: accountId,
        userId,
        balance: 1000,
      };

      const updatedAccount = {
        id: accountId,
        userId,
        balance: 2000,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockPrismaService.account.findUnique.mockResolvedValue(existingAccount);
      mockPrismaService.account.update.mockResolvedValue(updatedAccount);

      const result = await service.update(accountId, userId, updateAccountDto);

      expect(result).toBeDefined();
      expect(result.balance).toBe(2000);
    });

    it('should throw NotFoundException when account does not exist', async () => {
      const accountId = 999;
      const userId = 1;
      const updateAccountDto = { balance: 2000 };

      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(
        service.update(accountId, userId, updateAccountDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when account belongs to another user', async () => {
      const accountId = 1;
      const userId = 1;
      const updateAccountDto = { balance: 2000 };

      const existingAccount = {
        id: accountId,
        userId: 2, // Different user
        balance: 1000,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(existingAccount);

      await expect(
        service.update(accountId, userId, updateAccountDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete an account successfully', async () => {
      const accountId = 1;
      const userId = 1;

      const existingAccount = {
        id: accountId,
        userId,
        balance: 0,
        transactions: [],
      };

      mockPrismaService.account.findUnique.mockResolvedValue(existingAccount);
      mockPrismaService.account.delete.mockResolvedValue(existingAccount);

      const result = await service.remove(accountId, userId);

      expect(result).toEqual({ message: 'Account deleted successfully' });
      expect(mockPrismaService.account.delete).toHaveBeenCalledWith({
        where: { id: accountId },
      });
    });

    it('should throw NotFoundException when account does not exist', async () => {
      const accountId = 999;
      const userId = 1;

      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.remove(accountId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when account belongs to another user', async () => {
      const accountId = 1;
      const userId = 1;

      const existingAccount = {
        id: accountId,
        userId: 2, // Different user
        balance: 0,
        transactions: [],
      };

      mockPrismaService.account.findUnique.mockResolvedValue(existingAccount);

      await expect(service.remove(accountId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException when account has transactions', async () => {
      const accountId = 1;
      const userId = 1;

      const existingAccount = {
        id: accountId,
        userId,
        balance: 0,
        transactions: [{ id: 1, type: 'DEPOSIT', amount: 100 }],
      };

      mockPrismaService.account.findUnique.mockResolvedValue(existingAccount);

      await expect(service.remove(accountId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when account has positive balance', async () => {
      const accountId = 1;
      const userId = 1;

      const existingAccount = {
        id: accountId,
        userId,
        balance: 100,
        transactions: [],
      };

      mockPrismaService.account.findUnique.mockResolvedValue(existingAccount);

      await expect(service.remove(accountId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAccountBalance', () => {
    it('should return account balance', async () => {
      const accountId = 1;
      const userId = 1;
      const mockAccount = {
        id: accountId,
        userId,
        balance: 1500.5,
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
        transactions: [],
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      const result = await service.getAccountBalance(accountId, userId);

      expect(result).toEqual({ balance: 1500.5 });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    account: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deposit', () => {
    const depositDto = { accountId: 1, amount: 100000 };
    const userId = 1;

    it('should successfully deposit money', async () => {
      const mockAccount = { id: 1, userId: 1, balance: 500000 };
      const mockTransaction = {
        id: 1,
        type: 'DEPOSIT',
        amount: 100000,
        accountId: 1,
        account: mockAccount,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);
      mockPrismaService.$transaction.mockResolvedValue([
        mockTransaction,
        mockAccount,
      ]);

      const result = await service.deposit(userId, depositDto);

      expect(mockPrismaService.account.findUnique).toHaveBeenCalledWith({
        where: { id: depositDto.accountId },
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException when account not found', async () => {
      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.deposit(userId, depositDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user does not own account', async () => {
      const mockAccount = { id: 1, userId: 2, balance: 500000 };
      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.deposit(userId, depositDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('withdraw', () => {
    const withdrawDto = { accountId: 1, amount: 100000 };
    const userId = 1;

    it('should successfully withdraw money', async () => {
      const mockAccount = { id: 1, userId: 1, balance: 500000 };
      const mockTransaction = {
        id: 1,
        type: 'WITHDRAWAL',
        amount: 100000,
        accountId: 1,
        account: mockAccount,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);
      mockPrismaService.$transaction.mockResolvedValue([
        mockTransaction,
        mockAccount,
      ]);

      const result = await service.withdraw(userId, withdrawDto);

      expect(result).toEqual(mockTransaction);
    });

    it('should throw BadRequestException when insufficient balance', async () => {
      const mockAccount = { id: 1, userId: 1, balance: 50000 };
      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.withdraw(userId, withdrawDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('transfer', () => {
    const transferDto = { fromAccountId: 1, toAccountId: 2, amount: 100000 };
    const userId = 1;

    it('should successfully transfer money', async () => {
      const mockFromAccount = { id: 1, userId: 1, balance: 500000 };
      const mockToAccount = { id: 2, userId: 2, balance: 300000 };
      const mockTransferOut = {
        id: 1,
        type: 'TRANSFER_OUT',
        amount: 100000,
        accountId: 1,
        account: mockFromAccount,
      };
      const mockTransferIn = {
        id: 2,
        type: 'TRANSFER_IN',
        amount: 100000,
        accountId: 2,
        account: mockToAccount,
      };

      mockPrismaService.account.findUnique
        .mockResolvedValueOnce(mockFromAccount)
        .mockResolvedValueOnce(mockToAccount);
      mockPrismaService.$transaction.mockResolvedValue([
        mockTransferOut,
        mockTransferIn,
        mockFromAccount,
        mockToAccount,
      ]);

      const result = await service.transfer(userId, transferDto);

      expect(result).toEqual({
        transferOut: mockTransferOut,
        transferIn: mockTransferIn,
      });
    });

    it('should throw BadRequestException for self-transfer', async () => {
      const selfTransferDto = {
        fromAccountId: 1,
        toAccountId: 1,
        amount: 100000,
      };
      const mockAccount = { id: 1, userId: 1, balance: 500000 };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.transfer(userId, selfTransferDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all user transactions', async () => {
      const userId = 1;
      const mockAccounts = [{ id: 1 }, { id: 2 }];
      const mockTransactions = [
        { id: 1, type: 'DEPOSIT', amount: 100000, accountId: 1 },
        { id: 2, type: 'WITHDRAWAL', amount: 50000, accountId: 1 },
      ];

      mockPrismaService.account.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.transaction.findMany.mockResolvedValue(
        mockTransactions,
      );

      const result = await service.findAll(userId);

      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: { accountId: { in: [1, 2] } },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('findOne', () => {
    it('should return a specific transaction', async () => {
      const userId = 1;
      const transactionId = 1;
      const mockAccounts = [{ id: 1 }, { id: 2 }];
      const mockTransaction = {
        id: 1,
        type: 'DEPOSIT',
        amount: 100000,
        accountId: 1,
        account: { id: 1, userId: 1 },
      };

      mockPrismaService.account.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        mockTransaction,
      );

      const result = await service.findOne(userId, transactionId);

      expect(result).toEqual(mockTransaction);
    });

    it('should throw ForbiddenException when user does not own transaction', async () => {
      const userId = 1;
      const transactionId = 1;
      const mockAccounts = [{ id: 1 }];
      const mockTransaction = {
        id: 1,
        type: 'DEPOSIT',
        amount: 100000,
        accountId: 2, // Different account ID
        account: { id: 2, userId: 2 },
      };

      mockPrismaService.account.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        mockTransaction,
      );

      await expect(service.findOne(userId, transactionId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

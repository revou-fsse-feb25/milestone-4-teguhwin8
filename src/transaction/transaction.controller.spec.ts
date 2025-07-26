import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('should call deposit service method', async () => {
      const mockReq = { user: { id: 1 } };
      const depositDto = { accountId: 1, amount: 100000 };
      const mockResult = { id: 1, type: 'DEPOSIT', amount: 100000 };

      mockTransactionService.deposit.mockResolvedValue(mockResult);

      const result = await controller.deposit(mockReq, depositDto);

      expect(mockTransactionService.deposit).toHaveBeenCalledWith(
        mockReq.user.id,
        depositDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('withdraw', () => {
    it('should call withdraw service method', async () => {
      const mockReq = { user: { id: 1 } };
      const withdrawDto = { accountId: 1, amount: 50000 };
      const mockResult = { id: 2, type: 'WITHDRAWAL', amount: 50000 };

      mockTransactionService.withdraw.mockResolvedValue(mockResult);

      const result = await controller.withdraw(mockReq, withdrawDto);

      expect(mockTransactionService.withdraw).toHaveBeenCalledWith(
        mockReq.user.id,
        withdrawDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('transfer', () => {
    it('should call transfer service method', async () => {
      const mockReq = { user: { id: 1 } };
      const transferDto = { fromAccountId: 1, toAccountId: 2, amount: 75000 };
      const mockResult = {
        transferOut: { id: 3, type: 'TRANSFER_OUT', amount: 75000 },
        transferIn: { id: 4, type: 'TRANSFER_IN', amount: 75000 },
      };

      mockTransactionService.transfer.mockResolvedValue(mockResult);

      const result = await controller.transfer(mockReq, transferDto);

      expect(mockTransactionService.transfer).toHaveBeenCalledWith(
        mockReq.user.id,
        transferDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should call findAll service method', async () => {
      const mockReq = { user: { id: 1 } };
      const mockResult = [
        { id: 1, type: 'DEPOSIT', amount: 100000 },
        { id: 2, type: 'WITHDRAWAL', amount: 50000 },
      ];

      mockTransactionService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockReq);

      expect(mockTransactionService.findAll).toHaveBeenCalledWith(
        mockReq.user.id,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should call findOne service method', async () => {
      const mockReq = { user: { id: 1 } };
      const transactionId = 1;
      const mockResult = { id: 1, type: 'DEPOSIT', amount: 100000 };

      mockTransactionService.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne(mockReq, transactionId);

      expect(mockTransactionService.findOne).toHaveBeenCalledWith(
        mockReq.user.id,
        transactionId,
      );
      expect(result).toEqual(mockResult);
    });
  });
});

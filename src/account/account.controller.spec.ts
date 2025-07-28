import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';

const mockAccountService = {
  create: jest.fn(),
  findAllByUser: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getAccountBalance: jest.fn(),
};

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an account', async () => {
      const createAccountDto: CreateAccountDto = { balance: 5000000 };
      const mockUser = {
        id: 1,
        email: 'teguhwin8@gmail.com',
        name: 'Teguh Widodo',
      };
      const mockRequest = { user: mockUser };
      const mockAccount = new AccountResponseDto({
        id: 1,
        userId: 1,
        balance: 5000000,
        user: mockUser,
      });

      mockAccountService.create.mockResolvedValue(mockAccount);

      const result = await controller.create(mockRequest, createAccountDto);

      expect(service.create).toHaveBeenCalledWith(
        mockUser.id,
        createAccountDto,
      );
      expect(result).toEqual(mockAccount);
    });
  });

  describe('findAll', () => {
    it('should return all accounts for user', async () => {
      const mockUser = {
        id: 1,
        email: 'teguhwin8@gmail.com',
        name: 'Teguh Widodo',
      };
      const mockRequest = { user: mockUser };
      const mockAccounts = [
        new AccountResponseDto({
          id: 1,
          userId: 1,
          balance: 5000000,
          user: mockUser,
        }),
        new AccountResponseDto({
          id: 2,
          userId: 1,
          balance: 1500000,
          user: mockUser,
        }),
      ];

      mockAccountService.findAllByUser.mockResolvedValue(mockAccounts);

      const result = await controller.findAll(mockRequest);

      expect(service.findAllByUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('findOne', () => {
    it('should return an account by id', async () => {
      const accountId = 1;
      const mockUser = {
        id: 1,
        email: 'teguhwin8@gmail.com',
        name: 'Teguh Widodo',
      };
      const mockRequest = { user: mockUser };
      const mockAccount = new AccountResponseDto({
        id: accountId,
        userId: 1,
        balance: 5000000,
        user: mockUser,
      });

      mockAccountService.findOne.mockResolvedValue(mockAccount);

      const result = await controller.findOne(accountId, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(accountId, mockUser.id);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      const accountId = 1;
      const updateAccountDto: UpdateAccountDto = { balance: 3250000 };
      const mockUser = {
        id: 1,
        email: 'teguhwin8@gmail.com',
        name: 'Teguh Widodo',
      };
      const mockRequest = { user: mockUser };
      const mockAccount = new AccountResponseDto({
        id: accountId,
        userId: 1,
        balance: 3250000,
        user: mockUser,
      });

      mockAccountService.update.mockResolvedValue(mockAccount);

      const result = await controller.update(
        accountId,
        mockRequest,
        updateAccountDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        accountId,
        mockUser.id,
        updateAccountDto,
      );
      expect(result).toEqual(mockAccount);
    });
  });

  describe('remove', () => {
    it('should delete an account', async () => {
      const accountId = 1;
      const mockUser = {
        id: 1,
        email: 'teguhwin8@gmail.com',
        name: 'Teguh Widodo',
      };
      const mockRequest = { user: mockUser };
      const mockResponse = { message: 'Account deleted successfully' };

      mockAccountService.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove(accountId, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(accountId, mockUser.id);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getBalance', () => {
    it('should return account balance', async () => {
      const accountId = 1;
      const mockUser = {
        id: 1,
        email: 'teguhwin8@gmail.com',
        name: 'Teguh Widodo',
      };
      const mockRequest = { user: mockUser };
      const mockBalance = { balance: 5000000.0 };

      mockAccountService.getAccountBalance.mockResolvedValue(mockBalance);

      const result = await controller.getBalance(accountId, mockRequest);

      expect(service.getAccountBalance).toHaveBeenCalledWith(
        accountId,
        mockUser.id,
      );
      expect(result).toEqual(mockBalance);
    });
  });
});

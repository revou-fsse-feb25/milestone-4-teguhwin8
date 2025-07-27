import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Mock PrismaClient
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  account: {
    deleteMany: jest.fn(),
  },
  transaction: {
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Mock bcrypt
jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: Role.USER,
    };

    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const createdUser = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        role: Role.USER,
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
          role: 'USER',
        },
      });
      expect(result.email).toBe(createUserDto.email);
      expect(result.name).toBe(createUserDto.name);
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = { id: 1, email: createUserDto.email };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const userId = 1;
      const user = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        accounts: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findById(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { accounts: true },
      });
      expect(result.id).toBe(user.id);
      expect(result.email).toBe(user.email);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const userId = 1;
    const updateUserDto = { name: 'Updated Name' };

    it('should update user successfully', async () => {
      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      };
      const updatedUser = { ...existingUser, name: updateUserDto.name };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: updateUserDto.name },
      });
      expect(result.name).toBe(updateUserDto.name);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const userId = 1;

    it('should delete user successfully', async () => {
      const existingUser = {
        id: userId,
        email: 'test@example.com',
        accounts: [
          {
            id: 1,
            transactions: [{ id: 1 }, { id: 2 }],
          },
          {
            id: 2,
            transactions: [{ id: 3 }],
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockPrisma = {
          transaction: { deleteMany: jest.fn() },
          account: { deleteMany: jest.fn() },
          user: { delete: jest.fn() },
        };
        return await callback(mockPrisma);
      });

      await service.remove(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          accounts: {
            include: {
              transactions: true,
            },
          },
        },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validatePassword', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should return user data if password is valid', async () => {
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword(email, password);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    });

    it('should return null if password is invalid', async () => {
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword(email, password);

      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validatePassword(email, password);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          role: Role.USER,
          createdAt: new Date(),
          accounts: [],
        },
        {
          id: 2,
          email: 'admin@example.com',
          name: 'Admin',
          role: Role.ADMIN,
          createdAt: new Date(),
          accounts: [],
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: {
          accounts: true,
        },
      });
      expect(result).toHaveLength(2);
      expect(result[0].role).toBe(Role.USER);
      expect(result[1].role).toBe(Role.ADMIN);
    });
  });

  describe('updateRole', () => {
    it('should update user role successfully', async () => {
      const userId = 1;
      const newRole = Role.ADMIN;
      const existingUser = {
        id: userId,
        email: 'user@example.com',
        name: 'User',
        role: Role.USER,
        createdAt: new Date(),
      };
      const updatedUser = {
        ...existingUser,
        role: newRole,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateRole(userId, newRole);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { role: newRole },
      });
      expect(result.role).toBe(newRole);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 1;
      const newRole = Role.ADMIN;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateRole(userId, newRole)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

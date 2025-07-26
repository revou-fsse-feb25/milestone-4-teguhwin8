import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock PrismaClient
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('../../generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaService),
}));

// Mock bcrypt
jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
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
    };

    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const createdUser = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
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
      const existingUser = { id: userId, email: 'test@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.delete.mockResolvedValue(existingUser);

      await service.remove(userId);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
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
});

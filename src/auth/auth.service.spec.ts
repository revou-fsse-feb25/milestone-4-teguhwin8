import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/user-response.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUserService = {
    create: jest.fn(),
    validatePassword: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register user successfully', async () => {
      const createdUser = new UserResponseDto({
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        createdAt: new Date(),
        password: 'hashedPassword',
      });

      const mockToken = 'mock-jwt-token';
      const mockExpiresIn = '7d';

      mockUserService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue(mockToken);
      mockConfigService.get.mockReturnValue(mockExpiresIn);

      const result = await service.register(registerDto);

      expect(mockUserService.create).toHaveBeenCalledWith(registerDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: createdUser.id,
        email: createdUser.email,
      });
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toBe(createdUser);
      expect(result.expires_in).toBe(mockExpiresIn);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserService.create.mockRejectedValue(
        new ConflictException('User with this email already exists'),
      );

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const user = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        createdAt: new Date(),
      };

      const mockToken = 'mock-jwt-token';
      const mockExpiresIn = '7d';

      mockUserService.validatePassword.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(mockToken);
      mockConfigService.get.mockReturnValue(mockExpiresIn);

      const result = await service.login(loginDto);

      expect(mockUserService.validatePassword).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(result.access_token).toBe(mockToken);
      expect(result.user.email).toBe(user.email);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserService.validatePassword.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    const payload = { sub: 1, email: 'test@example.com' };

    it('should validate user successfully', async () => {
      const user = new UserResponseDto({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        password: 'hashedPassword',
      });

      mockUserService.findById.mockResolvedValue(user);

      const result = await service.validateUser(payload);

      expect(mockUserService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(service.validateUser(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

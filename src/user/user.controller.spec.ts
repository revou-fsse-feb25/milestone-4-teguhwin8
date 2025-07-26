import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { id: 1 };
      const userResponse = new UserResponseDto({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        password: 'hashedPassword',
      });

      mockUserService.findById.mockResolvedValue(userResponse);

      const result = await controller.getProfile(user);

      expect(mockUserService.findById).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(userResponse);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const user = { id: 1 };
      const updateUserDto = { name: 'Updated Name' };
      const updatedUser = new UserResponseDto({
        id: 1,
        email: 'test@example.com',
        name: 'Updated Name',
        createdAt: new Date(),
        password: 'hashedPassword',
      });

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(user, updateUserDto);

      expect(mockUserService.update).toHaveBeenCalledWith(
        user.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account', async () => {
      const user = { id: 1 };

      mockUserService.remove.mockResolvedValue(undefined);

      await controller.deleteAccount(user);

      expect(mockUserService.remove).toHaveBeenCalledWith(user.id);
    });
  });
});

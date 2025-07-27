import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
      },
    });

    return new UserResponseDto(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Prepare update data
    const updateData: any = {};

    if (updateUserDto.name) {
      updateData.name = updateUserDto.name;
    }

    if (updateUserDto.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return new UserResponseDto(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async validatePassword(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}

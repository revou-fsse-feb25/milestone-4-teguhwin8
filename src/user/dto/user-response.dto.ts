import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'teguhwin8@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Teguh Widodo',
  })
  name: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    description: 'User creation date',
    example: '2025-01-27T10:00:00.000Z',
  })
  createdAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

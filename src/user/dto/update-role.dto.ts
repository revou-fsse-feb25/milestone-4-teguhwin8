import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'User role',
    example: 'ADMIN',
    enum: Role,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

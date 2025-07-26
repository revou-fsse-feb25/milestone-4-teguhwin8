import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class AccountResponseDto {
  @ApiProperty({
    description: 'Account ID',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Account owner user ID',
    example: 1,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: 'Current account balance',
    example: 5000.5,
  })
  @Expose()
  balance: number;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2025-01-27T10:30:00.000Z',
  })
  @Expose()
  createdAt?: Date;

  @ApiProperty({
    description: 'Account last update timestamp',
    example: '2025-01-27T10:35:00.000Z',
  })
  @Expose()
  updatedAt?: Date;

  @ApiProperty({
    description: 'Account owner information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'John Doe' },
      email: { type: 'string', example: 'john@example.com' },
    },
  })
  @Expose()
  user?: {
    id: number;
    name: string;
    email: string;
  };

  constructor(partial: Partial<AccountResponseDto>) {
    Object.assign(this, partial);
  }
}

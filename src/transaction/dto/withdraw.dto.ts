import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({
    description: 'Account ID to withdraw money from',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  accountId: number;

  @ApiProperty({
    description: 'Amount to withdraw (minimum Rp 10,000)',
    example: 100000,
    minimum: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(10000) // Minimum withdrawal Rp 10,000
  @Type(() => Number)
  amount: number;
}

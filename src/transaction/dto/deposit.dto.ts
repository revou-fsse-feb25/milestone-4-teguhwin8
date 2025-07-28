import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({
    description: 'Account ID to deposit money into',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  accountId: number;

  @ApiProperty({
    description: 'Amount to deposit (minimum Rp 1,000)',
    example: 500000,
    minimum: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1000) // Minimum deposit Rp 1,000
  @Type(() => Number)
  amount: number;
}

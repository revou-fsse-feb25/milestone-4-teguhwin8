import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({
    description: 'Source account ID to transfer money from',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  fromAccountId: number;

  @ApiProperty({
    description: 'Destination account ID to transfer money to',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  toAccountId: number;

  @ApiProperty({
    description: 'Amount to transfer (minimum Rp 1,000)',
    example: 250000,
    minimum: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1000) // Minimum transfer Rp 1,000
  @Type(() => Number)
  amount: number;
}

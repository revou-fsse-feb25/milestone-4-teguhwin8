import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  fromAccountId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  toAccountId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1000) // Minimum transfer Rp 1,000
  @Type(() => Number)
  amount: number;
}

import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DepositDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  accountId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1000) // Minimum deposit Rp 1,000
  @Type(() => Number)
  amount: number;
}

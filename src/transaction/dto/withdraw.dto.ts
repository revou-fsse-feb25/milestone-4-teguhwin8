import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  accountId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(10000) // Minimum withdrawal Rp 10,000
  @Type(() => Number)
  amount: number;
}

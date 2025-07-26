import { IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Initial balance for the account',
    example: 1000.0,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  balance: number;
}

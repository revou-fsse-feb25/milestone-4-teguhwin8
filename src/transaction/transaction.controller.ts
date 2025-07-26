import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  async deposit(@Request() req, @Body() depositDto: DepositDto) {
    return this.transactionService.deposit(req.user.id, depositDto);
  }

  @Post('withdraw')
  async withdraw(@Request() req, @Body() withdrawDto: WithdrawDto) {
    return this.transactionService.withdraw(req.user.id, withdrawDto);
  }

  @Post('transfer')
  async transfer(@Request() req, @Body() transferDto: TransferDto) {
    return this.transactionService.transfer(req.user.id, transferDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.transactionService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findOne(req.user.id, id);
  }
}

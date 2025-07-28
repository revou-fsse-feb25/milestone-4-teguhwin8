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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @ApiOperation({ summary: 'Get all transactions for current user' })
  async findAll(@Request() req) {
    return this.transactionService.findAll(req.user.id);
  }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all transactions (Admin only)' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async findAllTransactions() {
    return this.transactionService.findAllTransactions();
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findOne(req.user.id, id);
  }
}

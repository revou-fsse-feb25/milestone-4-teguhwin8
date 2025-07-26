import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account created successfully',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async create(
    @Request() req,
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return await this.accountService.create(req.user.id, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user accounts',
    type: [AccountResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async findAll(@Request() req): Promise<AccountResponseDto[]> {
    return await this.accountService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({
    name: 'id',
    description: 'Account ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account details',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Account not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - not your account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<AccountResponseDto> {
    return await this.accountService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiParam({
    name: 'id',
    description: 'Account ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account updated successfully',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Account not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - not your account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    return await this.accountService.update(id, req.user.id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiParam({
    name: 'id',
    description: 'Account ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Account deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Account not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - not your account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete account with transactions or positive balance',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    return await this.accountService.remove(id, req.user.id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiParam({
    name: 'id',
    description: 'Account ID',
    type: 'integer',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account balance',
    schema: {
      type: 'object',
      properties: {
        balance: {
          type: 'number',
          example: 5000.5,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Account not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied - not your account',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getBalance(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ balance: number }> {
    return await this.accountService.getAccountBalance(id, req.user.id);
  }
}

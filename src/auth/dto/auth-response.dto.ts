import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Token expiration time',
    example: '7d',
  })
  expires_in: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  constructor(
    access_token: string,
    user: UserResponseDto,
    expires_in: string = '7d',
  ) {
    this.access_token = access_token;
    this.token_type = 'Bearer';
    this.expires_in = expires_in;
    this.user = user;
  }
}

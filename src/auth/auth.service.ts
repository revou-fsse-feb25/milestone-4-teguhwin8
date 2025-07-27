import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      // Create user using UserService
      const user = await this.userService.create({
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name,
      });

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload);
      const expires_in =
        this.configService.get<string>('JWT_EXPIRES_IN') || '7d';

      return new AuthResponseDto(access_token, user, expires_in);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Validate user credentials
    const user = await this.userService.validatePassword(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);
    const expires_in = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';

    // Convert user to UserResponseDto
    const userResponse = new UserResponseDto(user);

    return new AuthResponseDto(access_token, userResponse, expires_in);
  }

  async validateUser(payload: JwtPayload): Promise<UserResponseDto> {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}

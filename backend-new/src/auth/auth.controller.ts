import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SignUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  async signIn(@Body() signUserDto: SignUserDto) {
    return this.authService.signIn(signUserDto);
  }
}

import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RtGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from './dto';
import { Tokens } from '../types';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDTO): Promise<Tokens> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDTO): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshTokens') refreshTokens: string,
  ) {
    return this.authService.refreshTokens(userId, refreshTokens);
  }
}

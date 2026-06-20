import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { type AuthRequest } from './interfaces/auth-request.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { CurrentAuth } from './decorators/current-auth.decorator';

@ApiTags(`Auth`)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  ///
  /// 회원가입
  ///
  @Post('register')
  @ApiOperation({ summary: "회원가입" })
  register(@Body() registerAutoDto: RegisterAuthDto) {
    return this.authService.register(registerAutoDto);
  }

  ///
  /// 로그인
  ///
  @Post('login')
  @ApiOperation({ summary: "로그인" })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  ///
  /// 로그아웃
  ///
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "로그아웃" })
  logout(@CurrentAuth() auth: AuthRequest) {
    return this.authService.logout(auth);
  }

  ///
  /// 현재 로그인 상태 조회
  ///
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "현재 로그인 상태 조회"})
  me(@CurrentAuth() auth: AuthRequest) {
    return this.authService.me(auth);
  }
}

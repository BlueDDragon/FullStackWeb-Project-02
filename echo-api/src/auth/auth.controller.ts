import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MeAuthDto } from './dto/me-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthRequest } from './interfaces/auth-request.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "회원가입" })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: "로그인" })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('logout') 
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "로그아웃" })
  logout(@Req() req: AuthRequest) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    return this.authService.logout(req.user, token);
  }
  
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "현재 로그인 상태 호출" })
  me(@Req() req: AuthRequest) {
    return this.authService.me(req.user);
  }
}
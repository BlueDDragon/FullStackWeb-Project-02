import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthRequest } from './interfaces/auth-request.interface';
import * as bcrypt from 'bcrypt';
import { bcryptConstants } from '../common/constants';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  ///
  /// 회원가입
  ///
  async register(registerAutoDto: RegisterAuthDto) {
    const { username, displayName, email } = registerAutoDto;

    const passwordHash = await bcrypt.hash(registerAutoDto.password, bcryptConstants.round);
    const { password, ...result } = await this.userService.create({ username, displayName, email, password: passwordHash });

    return { user: {...result} };
  }

  ///
  /// 로그인
  ///
  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findByUsername(loginAuthDto.username);

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException();

    const userPayLoad: JwtPayload = {
      sub: user.id,
      username: user.username,
      displayname: user.displayName,
    };

    const accessToken = this.jwtService.sign(userPayLoad);
    const { password, ...result } = user;
    return { login: true, accessToken, user: {...result} }
  }

  ///
  /// 로그아웃
  ///
  async logout(auth: AuthRequest) {
    // TODO: 로그아웃 블랙리스트 로직
    return { login: false };
  }

  ///
  /// 현재 로그인 상태 조회
  ///
  async me(auth: AuthRequest) {
    if (!auth) return { login: false };

    const user = await this.userService.findOne(auth.id);

    const { password, ...result } = user;
    return { login: true, user: {...result} };
  }
}

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthRequest } from './interfaces/auth-request.interface';
import * as bcrypt from 'bcrypt';
import { bcryptConstants } from '../common/constants';
import { AUTH_MESSAGES, COMMON_MESSAGES } from '../common/messages';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerAutoDto: RegisterAuthDto) {
    const { username, displayName, email } = registerAutoDto;

    const passwordHash = await bcrypt.hash(registerAutoDto.password, bcryptConstants.round);
    const { password, ...result } = await this.userService.create({ username, displayName, email, password: passwordHash });

    return { messages: AUTH_MESSAGES.SUCCESS.REGISTER, user: {...result} };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findByUsername(loginAuthDto.username);

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.LOGIN_VALID_PW);

    const userPayLoad: JwtPayload = {
      sub: user.id,
      username: user.username,
      displayname: user.displayName,
    };

    const accessToken = this.jwtService.sign(userPayLoad);
    const { password, ...result } = user;
    return { messages: AUTH_MESSAGES.SUCCESS.LOGIN, login: true, accessToken, user: {...result} }
  }

  // TODO
  async logout(auth: AuthRequest) {
    return { messages: AUTH_MESSAGES.SUCCESS.LOGOUT, login: false };
  }

  async me(auth: AuthRequest) {
    if (!auth) return { messages: COMMON_MESSAGES.ERROR.UNAUTHORIZED, login: false };

    const user = await this.userService.findOne(auth.id);

    const { password, ...result } = user;
    return { messages: AUTH_MESSAGES.SUCCESS.ME, login: true, user: {...result} };
  }
}

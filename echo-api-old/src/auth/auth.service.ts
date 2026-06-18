import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MeAuthDto } from './dto/me-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_MESSAGES } from '../messages/auth.messages';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { COMMON_MESSAGES } from '../messages/common.messages';
import { UserService } from '../user/user.service';
import { bcryptConstants } from '../constants';
// import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    /*@Inject() private readonly redis: RedisService*/ ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const { userId, username, email } = registerAuthDto;

    const exitUserId = await this.userService.findByUserId(userId);
    if (exitUserId) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_ID, userId);
    
    const exitEmail = await this.userService.findByEmail(email);
    if (exitEmail) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL, email);

    const passwordHash = await bcrypt.hash(registerAuthDto.password, bcryptConstants.round);
    const createdUser = await this.userService.create({ userId, username, email, password: passwordHash });

    return { messages: AUTH_MESSAGES.SUCCESS.REGISTER, user: createdUser };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findByUserId(loginAuthDto.userId);
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.LOGIN_VALID_ID);

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.LOGIN_VALID_PW);

    const userPayLoad: JwtPayload = {
      sub: user.user.id,
      userId: user.user.userId,
      username: user.user.username,
    };

    const accessToken = this.jwtService.sign(userPayLoad);
    return { messages: AUTH_MESSAGES.SUCCESS.LOGIN, login: true, accessToken, user: { ...userPayLoad }};
  }

  async logout(userPayLoad: JwtPayload, token: string) {
    // const decoded = this.jwtService.decode(token) as { exp: number };
    // const now = Math.floor(Date.now() / 1000);
    // const ttl = decoded.exp - now;
    // if (ttl > 0) await this.redis.set(`blacklist:${token}`, userPayLoad.userId, ttl);

    return { messages: AUTH_MESSAGES.SUCCESS.LOGOUT, login: false, user: {...userPayLoad}};
  }

  async me(userPayLoad: JwtPayload) {
    console.log(`userPayLoad:`, userPayLoad);

    if (!userPayLoad) return { messages: COMMON_MESSAGES.ERROR.UNAUTHORIZED, login: false };

    const user = await this.userService.findOne(userPayLoad.sub);
    if (!user) return { messages: COMMON_MESSAGES.ERROR.UNAUTHORIZED, login: false };

    return { messages: AUTH_MESSAGES.SUCCESS.ME, login: true, user };
  }
}

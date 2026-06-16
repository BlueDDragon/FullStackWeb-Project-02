import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeAuthDto } from './dto/me-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_MESSAGES } from '../messages/auth.messages';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { COMMON_MESSAGES } from '../messages/common.messages';
// import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    /*@Inject() private readonly redis: RedisService*/ ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const exitUserId = await this.prisma.user.findUnique({ where: { userId: registerAuthDto.userId }});
    if (exitUserId) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_ID, registerAuthDto.userId);
    
    const exitEmail = await this.prisma.user.findUnique({ where: { email: registerAuthDto.email }});
    if (exitEmail) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL, registerAuthDto.email);

    const passwordHash = await bcrypt.hash(registerAuthDto.password, Number(process.env.BCRYPT_ROUND) || 10);
    const data = { ...registerAuthDto, password: passwordHash };
    const { password, ...result } = await this.prisma.user.create({ data: data });

    return { messages: AUTH_MESSAGES.SUCCESS.REGISTER, user: result };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({ where: { userId: loginAuthDto.userId }});
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.LOGIN_VALID_ID);

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.LOGIN_VALID_PW);

    const userPayLoad: JwtPayload = {
      sub: user.id,
      userId: user.userId,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(userPayLoad);
    return { messages: AUTH_MESSAGES.SUCCESS.LOGIN, login: true, accessToken, user: { ...userPayLoad }};
  }

  async logout(userPayLoad: JwtPayload, token: string) {
    // const decoded = this.jwtService.decode(token) as { exp: number };
    // const now = Math.floor(Date.now() / 1000);
    // const ttl = decoded.exp - now;
    // if (ttl > 0) await this.redis.set(`blacklist:${token}`, userPayLoad.userId, ttl);

    return { messages: AUTH_MESSAGES.SUCCESS.LOGOUT, logout: true, user: {...userPayLoad}};
  }

  async me(userPayLoad: JwtPayload) {
    console.log(`userPayLoad:`, userPayLoad);

    if (!userPayLoad) return { messages: COMMON_MESSAGES.ERROR.UNAUTHORIZED, login: false };

    const user = await this.prisma.user.findUnique({
      where: { id: userPayLoad.sub },
      select: { userId: true, username: true, profileImageUrl: true, createdAt: true },
    });
    if (!user) return { messages: COMMON_MESSAGES.ERROR.UNAUTHORIZED, login: false };

    return { messages: AUTH_MESSAGES.SUCCESS.ME, login: true, user };
  }
}

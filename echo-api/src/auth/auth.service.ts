import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeAuthDto } from './dto/me-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_MESSAGES } from '../messages/auth.messages';
// import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    /*@Inject() private readonly redis: RedisService*/ ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { userId, password } = loginAuthDto;
    
    const user = await this.prisma.user.findUnique({ where: { userId: userId }});
    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.LOGIN_VALID_ID);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.LOGIN_VALID_PW);

    const userPayLoad: JwtPayload = {
      id: user.id,
      userId: user.userId,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(userPayLoad);
    return { accessToken, user: { ...userPayLoad }};
  }

  async logout(userPayLoad: JwtPayload, token: string) {
    // const decoded = this.jwtService.decode(token) as { exp: number };
    // const now = Math.floor(Date.now() / 1000);
    // const ttl = decoded.exp - now;
    // if (ttl > 0) await this.redis.set(`blacklist:${token}`, userPayLoad.userId, ttl);

    return { logout: true, user: {...userPayLoad}};
  }

  async me(userPayLoad: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: userPayLoad.id },
      select: { userId: true, username: true, profileImageUrl: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}

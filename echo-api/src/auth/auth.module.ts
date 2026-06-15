import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import Redis from 'ioredis';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as any,
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}

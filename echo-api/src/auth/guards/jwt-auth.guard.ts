import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Redis from 'ioredis';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly redis: Redis) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isValid = await super.canActivate(context);
        if (!isValid) return false;

        const req = context.switchToHttp().getRequest();
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) throw new UnauthorizedException();

        const token = authorization.split(' ')[1];
        if (!token) throw new UnauthorizedException();

        // const isBlacklisted = await this.redis.exists(`blacklist:${token}`);
        // if (isBlacklisted) throw new UnauthorizedException();

        return true;
    }
}
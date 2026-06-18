import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}

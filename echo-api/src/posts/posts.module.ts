import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  controllers: [PostsController],
  providers: [PostsService, UsersService, JwtStrategy],
})
export class PostsModule {}

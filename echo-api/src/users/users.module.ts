import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PostsModule } from '../posts/posts.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [
    forwardRef(() => PostsModule),
    forwardRef(() => LikesModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}

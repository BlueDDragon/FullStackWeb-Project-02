import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => LikesModule)
  ],
  controllers: [PostsController],
  providers: [PostsService, JwtStrategy],
  exports: [PostsService],
})
export class PostsModule {}

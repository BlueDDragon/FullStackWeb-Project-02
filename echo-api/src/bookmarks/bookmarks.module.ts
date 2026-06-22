import { forwardRef, Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [UsersModule, PostsModule],
  controllers: [BookmarksController],
  providers: [BookmarksService, JwtStrategy],
  exports: [BookmarksService],
})
export class BookmarksModule {}

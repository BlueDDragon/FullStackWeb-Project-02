import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { LikesModule } from './likes/likes.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { uploadConstans } from './common/constants';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, BookmarksModule, LikesModule, PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), uploadConstans.dir),
      serveRoot: `/${uploadConstans.dir}`,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

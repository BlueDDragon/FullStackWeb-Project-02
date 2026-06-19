import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { CreateBookmarkFolderDto } from './dto/create-bookmark-folder.dto';
import { UpdateBookmarkFolderDto } from './dto/update-bookmark-folder.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { COMMON_MESSAGES } from '../common/messages';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService,
    
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
  ) {}


  async createBookmarkFolder(createBookmarkFolderDto: CreateBookmarkFolderDto, auth: AuthRequest) {
    await this.userService.findOne(auth.id);

    const folder = await this.prisma.bookmarkFolder.create({
      data: { ...createBookmarkFolderDto, userId: auth.id },
    });

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, folder: folder };
  }

  async findOneBookmarkFolder(folderId: string) {
    const folder = await this.prisma.bookmarkFolder.findUnique({ where: { id: folderId }});
    if (!folder) throw new NotFoundException(COMMON_MESSAGES.ERROR.NOT_FOUND);
    return folder;
  }

  async updateBookmarkFolder(folderId: string, updateBookmarkFolderDto: UpdateBookmarkFolderDto, auth: AuthRequest) {
    this.findOneBookmarkFolder(folderId);

    const folder = this.prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: { ...updateBookmarkFolderDto },
    });

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, folder: folder };
  }

  async removeBookmarkFolder(folderId: string, auth: AuthRequest) {
    
  }


  async createBookmark(createBookmarkDto: CreateBookmarkDto, auth: AuthRequest) {
  }

  async updateBookmark(bookmarkId: string, updateBookmarkDto: UpdateBookmarkDto, auth: AuthRequest) {
  }

  async removeBookmark(bookmarkId: string, auth: AuthRequest) {
  }
}

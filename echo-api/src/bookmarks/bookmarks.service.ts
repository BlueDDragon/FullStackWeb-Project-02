import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async findBookmarkFolder(folderId: string) {
    const folder = await this.prisma.bookmarkFolder.findUnique({ where: { id: folderId }});
    if (!folder) throw new NotFoundException(COMMON_MESSAGES.ERROR.NOT_FOUND);
    return folder;
  }

  async updateBookmarkFolder(folderId: string, updateBookmarkFolderDto: UpdateBookmarkFolderDto, auth: AuthRequest) {
    const folder = await this.findBookmarkFolder(folderId);
    if (folder.userId != auth.id) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const updatedFolder = await this.prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: { ...updateBookmarkFolderDto },
    });

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, folder: updatedFolder };
  }

  async removeBookmarkFolder(folderId: string, auth: AuthRequest) {
    const removedFolder = await this.findBookmarkFolder(folderId);
    if (removedFolder.userId != auth.id) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    await this.prisma.bookmarkFolder.delete({ where: { id: folderId }});

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, folder: removedFolder };
  }


  async createBookmark(createBookmarkDto: CreateBookmarkDto, auth: AuthRequest) {
    await this.userService.findOne(auth.id);
    
    const folder = await this.findBookmarkFolder(createBookmarkDto.folderId);
    if (folder.userId != auth.id) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    await this.postService.findOne(createBookmarkDto.postId);
    await this.exitsBookmark(createBookmarkDto.folderId, createBookmarkDto.postId);

    const bookmark = await this.prisma.bookmark.create({
      data: { ...createBookmarkDto, }
    });

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, bookmark: bookmark };
  }

  async findBookmark(folderId: string, postId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { bookmarkId: { folderId, postId } }});
    if (!bookmark) throw new NotFoundException(COMMON_MESSAGES.ERROR.NOT_FOUND);
    return bookmark;
  }

  async exitsBookmark(folderId: string, postId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { bookmarkId: { folderId, postId } }});
    if (bookmark) throw new ConflictException(COMMON_MESSAGES.ERROR.CONFLICT);
  }

  async removeBookmark(folderId: string, postId: number, auth: AuthRequest) {
    const folder = await this.findBookmarkFolder(folderId);
    if (folder.userId != auth.id) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const removedBookmark = await this.findBookmark(folderId, postId);

    await this.prisma.bookmark.delete({ where: { bookmarkId: { folderId, postId }}});

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, bookmark: removedBookmark };
  }
}

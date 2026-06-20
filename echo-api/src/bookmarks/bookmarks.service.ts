import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { CreateBookmarkFolderDto } from './dto/create-bookmark-folder.dto';
import { UpdateBookmarkFolderDto } from './dto/update-bookmark-folder.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { USER_SELECT } from '../users/user.select';
import { POST_SELECT } from '../posts/post.select';
import { getPagination, getTotalPage } from '../pagination/pagination';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService,
    
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
  ) {}

  ///
  /// 생성/중복 조회
  ///
  async findBookmarkFolder(folderId: string) {
    const folder = await this.prisma.bookmarkFolder.findUnique({ where: { id: folderId }});
    if (!folder) throw new NotFoundException();
    return folder;
  }
  
  async findBookmark(folderId: string, postId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { bookmarkId: { folderId, postId } }});
    if (!bookmark) throw new NotFoundException();
    return bookmark;
  }

  async existsBookmark(folderId: string, postId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { bookmarkId: { folderId, postId } }});
    if (bookmark) throw new ConflictException();
  }

  ///
  /// 정보 조회
  ///
  async getBookmarkFolder(auth: AuthRequest) {
    const folders = await this.prisma.bookmarkFolder.findMany({ where: { userId: auth.id }});
    return { folders: folders };
  }

  async getBookmark(folderId: string, auth: AuthRequest, page: number = 1, limit = 10) {
    const [folder, total] = await Promise.all([
      this.prisma.bookmarkFolder.findUnique({ 
        where: { id: folderId },
        select: {
          id: true,
          name: true,
          description: true,
          userId: true,
          bookmarks: { 
            select: { post: { select: POST_SELECT }},
            ...getPagination(page, limit),
          },
        },
      }),
      this.prisma.bookmark.count({
        where: { folderId: folderId },
      }),
    ]);
    
    if (!folder) throw new NotFoundException();
    if (folder.userId !== auth.id) throw new UnauthorizedException();
  
    const totalPage = getTotalPage(total, limit);
      
    return { bookmark: folder.bookmarks, pagination: { page, limit, total, totalPage }};
  }

  async getBookmarkPost(folderId: string, postId: number, auth: AuthRequest) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { bookmarkId: { folderId, postId }},
      select: {
        folder: { select: { userId: true }},
        post: { select: POST_SELECT }
      }
    })

    if (!bookmark) throw new NotFoundException();
    if (bookmark.folder.userId !== auth.id) throw new UnauthorizedException();
    
    return { post: bookmark.post };
  }


  ///
  /// 기본 CRUD (폴더)
  ///
  async createBookmarkFolder(createBookmarkFolderDto: CreateBookmarkFolderDto, auth: AuthRequest) {
    await this.userService.findOne(auth.id);

    const folder = await this.prisma.bookmarkFolder.create({
      data: { ...createBookmarkFolderDto, userId: auth.id },
    });

    return { folder: folder };
  }

  async updateBookmarkFolder(folderId: string, updateBookmarkFolderDto: UpdateBookmarkFolderDto, auth: AuthRequest) {
    const folder = await this.findBookmarkFolder(folderId);
    if (folder.userId !== auth.id) throw new UnauthorizedException();

    const updatedFolder = await this.prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: { ...updateBookmarkFolderDto },
    });

    return { folder: updatedFolder };
  }

  async removeBookmarkFolder(folderId: string, auth: AuthRequest) {
    const removedFolder = await this.findBookmarkFolder(folderId);
    if (removedFolder.userId !== auth.id) throw new UnauthorizedException();

    await this.prisma.bookmarkFolder.delete({ where: { id: folderId }});

    return { folder: removedFolder };
  }

  ///
  /// 기본 CRUD (북마크)
  ///
  async createBookmark(folderId: string, postId: number, auth: AuthRequest) {
    await this.userService.findOne(auth.id);
    
    const folder = await this.findBookmarkFolder(folderId);
    if (folder.userId !== auth.id) throw new UnauthorizedException();

    await this.postService.findOne(postId);
    await this.existsBookmark(folderId, postId);

    const bookmark = await this.prisma.bookmark.create({
      data: { folderId, postId, }
    });

    return { bookmark: bookmark };
  }

  async removeBookmark(folderId: string, postId: number, auth: AuthRequest) {
    const folder = await this.findBookmarkFolder(folderId);
    if (folder.userId !== auth.id) throw new UnauthorizedException();

    const removedBookmark = await this.findBookmark(folderId, postId);

    await this.prisma.bookmark.delete({ where: { bookmarkId: { folderId, postId }}});

    return { bookmark: removedBookmark };
  }
}

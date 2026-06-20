import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostWithImagesDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { POST_IMAGE_SELECT, POST_ORDERBY, POST_SELECT } from './post.select';
import { getPagination, getTotalPage } from '../pagination/pagination';
import { getImageId, getImageUploadUrl, removeOldFiles } from '../common/upload.util';
import { existsSync } from 'fs';
import { join, parse } from 'path';
import { LikesService } from '../likes/likes.service';
import { unlink } from 'fs/promises';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(forwardRef(() => LikesService))
    private readonly likeService: LikesService,
  ) {}

  ///
  /// 생성/중복 조회
  ///
  async findOne(postId: number) {
    const post = await this.prisma.post.findUnique({ 
      where: { id: postId },
      select: POST_SELECT,
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  async existsPost(postId: number) {
    const post = await this.prisma.post.findUnique({ 
      where: { id: postId },
      select: POST_SELECT,
    });
    if (post) throw new ConflictException();
  }

  ///
  /// 기본 CRUD
  ///
  async create(createPostDto: CreatePostDto, auth: AuthRequest, files: Express.Multer.File[]) {
    await this.userService.findOne(auth.id);

    if (createPostDto.rootPostId) await this.findOne(createPostDto.rootPostId);
    if (createPostDto.parentPostId) await this.findOne(createPostDto.parentPostId);

    const createdPostId = await this.prisma.$transaction(async (tx) => {
      const createdPost = await tx.post.create({
        data: {
          ...createPostDto,
          authorId: auth.id,
        }
      });

      if (!createPostDto.rootPostId) {
        await tx.post.update({
          where: { id: createdPost.id },
          data: { rootPostId: createdPost.id },
        });
      }

      await this.uploadPostImagesTx(tx, createdPost.id, files);
      return createdPost.id;
    });

    const resultPost = await this.findOne(createdPostId);
    return { post: resultPost };
  }

  async update(postId: number, updatePostWithImagesDto: UpdatePostWithImagesDto, auth: AuthRequest, files: Express.Multer.File[]) {
    const post = await this.findOne(postId);
    if (auth.id !== post.authorId) throw new UnauthorizedException();

    const filePathsToDelete: string[] = [];

    await this.prisma.$transaction(async (tx) => {
      const { images, removeImages, ...result } = updatePostWithImagesDto;
      
      await tx.post.update({
        where: { id: postId },
        data: {
          ...result,
        }
      });

      await this.uploadPostImagesTx(tx, postId, files);

      const removedImages = await this.removePostImagesTx(tx, postId, removeImages);
      filePathsToDelete.push(...(removedImages.filePaths));
    });
    
    await Promise.all(
      filePathsToDelete.map(async (filePath) => {
        try {
          if (existsSync(filePath)) await unlink(filePath);
        } catch {
          console.log(`fail to image delete:`, filePath);
        }
      })
    );
    
    const resultPost = await this.findOne(postId);
    return { post: resultPost };
  }

  async remove(postId: number, auth: AuthRequest) {
    const removedPost = await this.findOne(postId);
    if (auth.id !== removedPost.authorId) throw new UnauthorizedException();

    await this.prisma.post.delete({ where: { id: postId }});
    await removeOldFiles(removedPost.images.map(img => img.imgUrl));

    return { post: removedPost };
  }
  
  ///
  /// 정보 조회
  ///
  async getPosts(page: number = 1, limit: number = 10) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        select: POST_SELECT,
        orderBy: POST_ORDERBY.NEWEST,
        ...getPagination(page, limit)
      }),
      this.prisma.post.count()
    ]);
    
    const totalPage = getTotalPage(total, limit);

    return { posts: posts, page, limit, total, totalPage };
  }

  async getPostsByUser(userId: string, page: number = 1, limit: number = 10) {
    await this.userService.findOne(userId);

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: userId },
        select: POST_SELECT, 
        orderBy: POST_ORDERBY.NEWEST, 
        ...getPagination(page, limit)
      }),
      this.prisma.post.count({
        where: { authorId: userId },
      }),
    ]);
    
    const totalPage = getTotalPage(total, limit);

    return { posts: posts, page, limit, total, totalPage };
  }

  async getMediaByUser(userId: string, page: number = 1, limit: number = 5) {
    await this.userService.findOne(userId);

    const [images, total] = await Promise.all([
      this.prisma.postImage.findMany({
        where: { post: { authorId: userId }},
        select: POST_IMAGE_SELECT,
        ...getPagination(page, limit),
      }),
      this.prisma.post.count({
        where: { authorId: userId, AND: { images: { some: {} }}},
      }),
    ]);

    const totalPage = getTotalPage(total, limit);

    return { media: images, page, limit, total, totalPage };
  }

  async getThread(postId: number) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { rootPostId: postId },
        select: POST_SELECT,
        orderBy: POST_ORDERBY.NEWEST
      }),
      this.prisma.post.count({
        where: { rootPostId: postId },
      })
    ]);

    const map = new Map();
    for (const post of posts) {
      map.set(post.id, {
        ...post,
        children: [],
      });
    }

    const roots: any = [];
    for (const post of map.values()) {
      if (post.parentPostId && map.has(post.parentPostId)) {
        map.get(post.parentPostId).children.push(post);
      } else {
        roots.push(post);
      }
    }

    return { posts: roots };
  }

  async getLikesByPost(postId: number, page: number = 1, limit: number = 10) {
    await this.findOne(postId);
    const likes = await this.likeService.findByPost(postId, page, limit);
    return { likes: likes }
  }

  ///
  /// 이미지 업로더
  ///
  private async uploadPostImagesTx(tx: Prisma.TransactionClient, postId: number, files: Express.Multer.File[]) {
    if (!files || files.length === 0) return { images: [] };

    const uploadedPosts = await Promise.all(
      files.map(file => {
        return tx.postImage.create({ 
          data: {
            id: getImageId(file),
            postId: postId,
            imgUrl: getImageUploadUrl(file),
          }, 
          select: POST_IMAGE_SELECT,
        })
      })
    );

    return { images: uploadedPosts };
  }

  private async removePostImagesTx(tx: Prisma.TransactionClient, postId: number, filenames: string[]) {
    if (!filenames || filenames.length === 0) return { removedImages: [], filePaths: [] };
    
    const removedImages: { imgUrl: string, }[] = [];
    const filePaths: string[] = [];
    
    for (const filename of filenames) {
      let imageId: string;
      
      try {
        imageId = parse(new URL(filename).pathname).name;
      } catch {
        throw new BadRequestException();
      }
      
      const removedImage = 
        await tx.postImage.findUnique({ 
          where: { id: imageId }, 
          select: { postId: true, imgUrl: true }
        });

      if (!removedImage || removedImage.postId !== postId)
        throw new NotFoundException();
      
      const pathname = new URL(removedImage.imgUrl).pathname;
      const filePath = join(process.cwd(), pathname.replace(/^\/+/, ''));
      
      await tx.postImage.delete({ where: { id: imageId }});
      removedImages.push({ imgUrl: removedImage.imgUrl });
      filePaths.push(filePath);
    }

    return { removedImages: removedImages, filePaths };
  }
}

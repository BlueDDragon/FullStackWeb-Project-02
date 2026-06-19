import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostWithImagesDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { COMMON_MESSAGES, POST_MESSAGES } from '../common/messages';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { POST_IMAGE_SELECT, POST_ORDERBY, POST_SELECT } from './post.select';
import { getPagination, getTotalPage } from '../pagination/pagination';
import { getImageId, getImageUploadUrl } from '../common/upload.config';
import { existsSync, unlinkSync } from 'fs';
import { parse } from 'path';
import { LikesService } from '../likes/likes.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(forwardRef(() => LikesService))
    private readonly likeService: LikesService,
  ) {}

  async create(createPostDto: CreatePostDto, auth: AuthRequest, files: Express.Multer.File[]) {
    await this.userService.findOne(auth.id);

    if (createPostDto.rootPostId) await this.findOne(createPostDto.rootPostId);
    if (createPostDto.parentPostId) await this.findOne(createPostDto.parentPostId);

    let createdPost = await this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: auth.id,
      }
    });

    if (!createPostDto.rootPostId) {
      createdPost = await this.prisma.post.update({
        where: { id: createdPost.id },
        data: { rootPostId: createdPost.id },
      });
    }

    const uploadedImages = await this.uploadPostImages(createdPost.id, auth, files);
    const resultPost = { ...createdPost, images: [...uploadedImages], };

    return { messages: POST_MESSAGES.SUCCESS.CREATE_POST, post: resultPost };
  }

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

    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, posts: posts, 
      page, limit, total, totalPage };
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

    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, /*user: result,*/ posts, 
      page, limit, total, totalPage };
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

    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, /*user: result,*/ media: images, 
      page, limit, total, totalPage };
  }

  async getThread(id: number, page: number = 1, limit: number = 10) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { rootPostId: id },
        select: POST_SELECT,
        orderBy: POST_ORDERBY.NEWEST,
        ...getPagination(page, limit)
      }),
      this.prisma.post.count({
        where: { rootPostId: id },
      })
    ]);
    
    const totalPage = getTotalPage(total, limit);

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

    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, posts: roots, 
      page, limit, total, totalPage };
  }

  async getLikesByPost(id: number, page: number = 1, limit: number = 10) {
    await this.findOne(id);
    const likes = await this.likeService.findByPost(id, page, limit);
    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, likes: likes }
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ 
      where: { id },
      select: POST_SELECT,
    });
    if (!post) throw new NotFoundException(POST_MESSAGES.ERROR.NOT_FOUND_POST);
    return post;
  }

  async update(id: number, updatePostWithImagesDto: UpdatePostWithImagesDto, auth: AuthRequest, files: Express.Multer.File[]) {
    const user = await this.userService.findOne(auth.id);
    const post = await this.findOne(id);
    if (user.id !== post.authorId) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const { images, removeImages, ...result } = updatePostWithImagesDto;
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        ...result,
      }
    });

    const uploadedImages = await this.uploadPostImages(updatedPost.id, auth, files);
    const removedImages = await this.removePostImages(id, auth, removeImages);
    const resultPost = await this.findOne(id);

    return { messages: POST_MESSAGES.SUCCESS.UPDATE_POST, post: resultPost, removed: removedImages };
  }

  async remove(id: number, auth: AuthRequest) {
    const user = await this.userService.findOne(auth.id);
    const removedPost = await this.findOne(id);
    if (user.id !== removedPost.authorId) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    await this.prisma.post.delete({ where: { id }});
    return { messages: POST_MESSAGES.SUCCESS.DELETE_POST, post: removedPost };
  }
  
  async uploadPostImages(id: number, auth: AuthRequest, files: Express.Multer.File[]) {
    if (!files || files.length === 0) return [];

    const user = await this.userService.findOne(auth.id);
    const post = await this.findOne(id);
    if (user.id !== post.authorId) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const uploadedPosts = await Promise.all(
      files.map(file => {
        return this.prisma.postImage.create({ 
          data: {
            id: getImageId(file),
            postId: id,
            imgUrl: getImageUploadUrl(file),
          }, 
          select: POST_IMAGE_SELECT,
        })
      })
    );

    return uploadedPosts;
  }

  async removePostImages(id: number, auth: AuthRequest, filenames: string[]) {
    if (!filenames || filenames.length === 0) return [];

    const user = await this.userService.findOne(auth.id);
    const post = await this.findOne(id);
    if (user.id !== post.authorId) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const removedImages: { imgUrl: string, }[] = [];

    for (const filename of filenames) {
      const pathname = new URL(filename).pathname;
      // if (existsSync(pathname)) {
        // unlinkSync(pathname);

        const imageId = parse(pathname).name;
        const removedImage = 
          await this.prisma.postImage.findUnique({ 
            where: { id: imageId }, 
            select: { postId: true, imgUrl: true }
          });

        if (!removedImage || removedImage.postId != id) return;
        
        await this.prisma.postImage.delete({ where: { id: imageId }});
        removedImages.push({ imgUrl: removedImage.imgUrl });
      // }
    }

    return { images: removedImages };
  }
}
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { COMMON_MESSAGES, POST_MESSAGES } from '../common/messages';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { domainConstants, portConstants, uploadConstans } from '../common/constants';
import { POST_ORDERBY, POST_SELECT } from './post.select';
import { getPagination, getTotalPage } from '../pagination/pagination';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService,
    private readonly userService: UsersService
  ) {}

  async create(createPostDto: CreatePostDto, auth: AuthRequest) {
    await this.userService.findOne(auth.id);

    if (createPostDto.rootPostId) await this.findOne(createPostDto.rootPostId);
    if (createPostDto.parentPostId) await this.findOne(createPostDto.parentPostId);

    const createdPost = await this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: auth.id,
      }
    });

    if (!createPostDto.rootPostId) {
      return await this.prisma.post.update({
        where: { id: createdPost.id },
        data: { rootPostId: createdPost.id },
      });
    }

    return { messages: POST_MESSAGES.SUCCESS.CREATE_POST, post: createdPost };
  }

  async findAll(page: number = 1, limit: number = 10) {
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

  async findThread(id: number, page: number = 1, limit: number = 10) {
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

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id }});
    if (!post) throw new NotFoundException(POST_MESSAGES.ERROR.NOT_FOUND_POST);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, auth: AuthRequest) {
    const user = await this.userService.findOne(auth.id);
    const post = await this.findOne(id);
    if (user.id !== post.authorId) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        ...updatePostDto,
      }
    });

    return { messages: POST_MESSAGES.SUCCESS.UPDATE_POST, post: updatedPost };
  }

  async remove(id: number, auth: AuthRequest) {
    const user = await this.userService.findOne(auth.id);
    const removedPost = await this.findOne(id);
    if (user.id !== removedPost.authorId) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    await this.prisma.post.delete({ where: { id }});
    return { messages: POST_MESSAGES.SUCCESS.DELETE_POST, post: removedPost };
  }
  
  async uploadPostImage(id: number, auth: AuthRequest, files: Express.Multer.File[]) {
    if (!files || files.length === 0) throw new BadRequestException(COMMON_MESSAGES.ERROR.BAD_REQUEST);

    const user = await this.userService.findOne(auth.id);
    const post = await this.findOne(id);
    if (user.id !== post.authorId) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const uploadedPosts = await Promise.all(
      files.map(file =>
        this.prisma.postImage.create({ 
          data: {
            postId: id,
            imgUrl: `${domainConstants.domain}:${portConstants.port}/${uploadConstans.postDir}/${file.filename}`,
          }, 
          select: {
            imgUrl: true,
          }
        })
      )
    );

    return uploadedPosts;
  }
}
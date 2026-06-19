import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { COMMON_MESSAGES } from '../common/messages';
import { getPagination, getTotalPage } from '../pagination/pagination';
import { POST_SELECT } from '../posts/post.select';
import { USER_SELECT } from '../users/user.select';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService,

    @Inject(forwardRef(() => PostsService))
    private readonly userService: UsersService,

    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
  ) {}

  async create(postId: number, auth: AuthRequest) {
    const post = await this.postService.findOne(postId);
    const user = await this.userService.findOne(auth.id);

    await this.exitsLike(post.id, user.id);

    const like = await this.prisma.postLike.create({
      data: { postId: post.id, userId: user.id, }
    });

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, like: like };
  }
  
  async findOne(postId: number, userId: string) {
    const like = await this.prisma.postLike.findUnique({ where: { likeId: { userId, postId } }});
    if (!like) throw new NotFoundException(COMMON_MESSAGES.ERROR.NOT_FOUND);
    return like;
  }

  async exitsLike(postId: number, userId: string) {
    const like = await this.prisma.postLike.findUnique({ where: { likeId: { userId, postId } }});
    if (like) throw new ConflictException(COMMON_MESSAGES.ERROR.CONFLICT);
  }

  async findByPost(postId: number, page: number = 1, limit: number = 10) {
    const [likes, total] = await Promise.all([
      this.prisma.postLike.findMany({
        where: { postId: postId },
        select: { user: { select: USER_SELECT }, },
        ...getPagination(page, limit),
      }),
      this.prisma.postLike.count({ where: { postId: postId }}),
    ]);

    const totalPage = getTotalPage(total, limit);

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, likes: likes,
      page, limit, total, totalPage };
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    const [likes, total] = await Promise.all([
      this.prisma.postLike.findMany({
        where: { userId: userId },
        select: { post: { select: POST_SELECT }, },
        ...getPagination(page, limit),
      }),
      this.prisma.postLike.count({ where: { userId: userId }}),
    ]);

    const totalPage = getTotalPage(total, limit);

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, likes: likes,
      page, limit, total, totalPage };
  }
  
  async remove(postId: number, auth: AuthRequest) {
    const post = await this.postService.findOne(postId);
    const user = await this.userService.findOne(auth.id);
    const like = await this.findOne(post.id, user.id);

    await this.prisma.postLike.delete({
      where: { likeId: { userId: user.id, postId: post.id }},
    });

    return { messages: COMMON_MESSAGES.SUCCESS.SUCCESS, like: like };
    
  }
}

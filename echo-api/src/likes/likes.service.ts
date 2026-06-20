import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { getPagination, getTotalPage } from '../pagination/pagination';
import { POST_SELECT } from '../posts/post.select';
import { USER_SELECT } from '../users/user.select';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
  ) {}

  ///
  /// 생성/중복 조회
  ///
  async findOne(postId: number, userId: string) {
    const like = await this.prisma.postLike.findUnique({ where: { likeId: { userId, postId } }});
    if (!like) throw new NotFoundException();
    return like;
  }

  async existsLike(postId: number, userId: string) {
    const like = await this.prisma.postLike.findUnique({ where: { likeId: { userId, postId } }});
    if (like) throw new ConflictException();
  }

  ///
  /// 정보 조회
  ///
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

    return { likes: likes, page, limit, total, totalPage };
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

    return { likes: likes, page, limit, total, totalPage };
  }
  
  ///
  /// 기본 CRUD
  ///
  async create(postId: number, auth: AuthRequest) {
    const post = await this.postService.findOne(postId);
    const user = await this.userService.findOne(auth.id);

    await this.existsLike(post.id, user.id);

    const like = await this.prisma.postLike.create({
      data: { postId: post.id, userId: user.id, }
    });

    return { like: like };
  }
  
  async remove(postId: number, auth: AuthRequest) {
    const post = await this.postService.findOne(postId);
    const user = await this.userService.findOne(auth.id);
    const like = await this.findOne(post.id, user.id);

    await this.prisma.postLike.delete({
      where: { likeId: { userId: user.id, postId: post.id }},
    });

    return { like: like };
  }
}

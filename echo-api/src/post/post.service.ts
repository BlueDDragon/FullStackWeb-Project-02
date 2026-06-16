import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { POST_MESSAGES } from '../messages/post.messages';
import { AUTH_MESSAGES } from '../messages/auth.messages';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
    
  async create(createPostDto: CreatePostDto) {
    const user = await this.prisma.user.findUnique({ where: { userId: createPostDto.userId }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_USER);

    let createdPost = await this.prisma.post.create({ data: createPostDto });
    if (createdPost.rootPostId === -1) {
      createdPost = await this.prisma.post.update({ where: { id: createdPost.id }, data: { rootPostId: createdPost.id }});
    }

    return { messages: POST_MESSAGES.SUCCESS.CREATE_POST, post: createdPost };
  }

  async findAll(queryPostDto: QueryPostDto) {
    const { page, limit } = queryPostDto;
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: "desc" }
      }),
      this.prisma.post.count()
    ]);
    const totalPage = Math.ceil(total / limit);
    
    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, posts: items, total, page, limit, totalPage };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id: id }});
    if (!post) throw new NotFoundException(POST_MESSAGES.ERROR.NOT_FOUND_POST);

    return { messages: POST_MESSAGES.SUCCESS.FIND_POST, post: post };
  }

  async findDetail(id: number) {
    const post = (await this.findOne(id)).post;
    // const posts = (await this.prisma.post.findMany({ where: { rootPostId: post.rootPostId }})).filter((p) => p.id !== id);
    const posts = await this.prisma.post.findMany({ where: { rootPostId: post.rootPostId }});

    return { messages: POST_MESSAGES.SUCCESS.FIND_POST, post: post, posts: posts };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    const removedPost = await this.findOne(id);
    await this.prisma.post.delete({ where: { id: id }});

    return { messages: POST_MESSAGES.SUCCESS.DELETE_POST, post: removedPost };
  }
}
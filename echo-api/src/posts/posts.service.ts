import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AUTH_MESSAGES, POST_MESSAGES } from '../messages';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService,
    private readonly userService: UsersService
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.userService.findByUsername(createPostDto.authorId);
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_USERNAME);

    const post = await this.prisma.post.create({
      data: {
        ...createPostDto,
      }
    });

    if (!createPostDto.rootPostId) {
      return await this.prisma.post.update({
        where: { id: post.id },
        data: { rootPostId: post.rootPostId },
      });
    }

    return post;
  }

  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id }});
    if (!post) throw new NotFoundException(POST_MESSAGES.ERROR.NOT_FOUND_POST);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id);

    return await this.prisma.post.update({
      where: { id },
      data: {
        ...updatePostDto,
      }
    });
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.prisma.post.delete({ where: { id }});
    return post;
  }
}

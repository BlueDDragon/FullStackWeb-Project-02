import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
    
  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({ data: createPostDto });
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
    
    return { items, total, page, limit, totalPage };
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

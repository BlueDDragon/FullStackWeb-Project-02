import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: "게시물 등록" })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: "게시물 목록" })
  findAll(@Query() query: QueryPostDto) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: "게시물 조회" })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "게시물 수정" })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "게시물 삭제" })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}

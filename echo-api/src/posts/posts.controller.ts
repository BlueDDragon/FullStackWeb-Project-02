import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "게시글 작성" })
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentAuth() auth: AuthRequest) {
    return this.postsService.create(createPostDto, auth);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "게시글 수정" })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePostDto: UpdatePostDto,
    @CurrentAuth() auth: AuthRequest) {
    return this.postsService.update(id, updatePostDto, auth);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "게시글 삭제" })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuth() auth: AuthRequest) {
    return this.postsService.remove(id, auth);
  }
}

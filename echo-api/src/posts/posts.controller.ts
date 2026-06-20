import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, CreatePostWithImagesDto } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostWithImagesDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadConstants } from '../common/constants';
import { createImageUploadOptions } from '../common/upload.config';
import { QueryPaginationDto } from '../pagination/query-pagination.dto';
import { unlink } from 'fs/promises';
import { cleanupOnError } from '../common/upload.util';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  ///
  /// 기본 CRUD
  ///
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreatePostWithImagesDto })
  @UseInterceptors(FilesInterceptor('images', 4, createImageUploadOptions(uploadConstants.postDir)))
  @ApiOperation({ summary: "게시글 작성" })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentAuth() auth: AuthRequest,
    @UploadedFiles() files: Express.Multer.File[]) {
    return cleanupOnError(files, () =>
      this.postsService.create(createPostDto, auth, files));
  }
  
  @Patch(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UpdatePostWithImagesDto })
  @UseInterceptors(FilesInterceptor('images', 4, createImageUploadOptions(uploadConstants.postDir)))
  @ApiOperation({ summary: "게시글 수정" })
  async update(
    @Param('postId', ParseIntPipe) postId: number, 
    @Body() updatePostWithImagesDto: UpdatePostWithImagesDto,
    @CurrentAuth() auth: AuthRequest,
    @UploadedFiles() files: Express.Multer.File[]) {
    return cleanupOnError(files, () =>
      this.postsService.update(postId, updatePostWithImagesDto, auth, files));
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "게시글 삭제" })
  remove(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentAuth() auth: AuthRequest) {
    return this.postsService.remove(postId, auth);
  }
  
  ///
  /// 정보 조회
  ///
  @Get('')
  @ApiOperation({ summary: "게시글 목록 조회" })
  getPosts(@Query() query: QueryPaginationDto) {
    return this.postsService.getPosts(query.page, query.limit);
  }
  
  @Get(':postId/thread')
  @ApiOperation({ summary: "게시글 목록 조회 (스레드 형태)" })
  getThread(
    @Param('postId', ParseIntPipe) postId: number) {
    return this.postsService.getThread(postId);
  }

  @Get(':postId/likes')
  @ApiOperation({ summary: "게시글 좋아요 목록 조회" })
  getLikesByUser(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: QueryPaginationDto) {
    return this.postsService.getLikesByPost(postId, query.page, query.limit);
  }
}

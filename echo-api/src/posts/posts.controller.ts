import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadConstans } from '../common/constants';
import { createImageUploadOptions } from '../common/upload.config';

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

  @Post(':id/post-images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: { images: {type: "array", items: { type: 'string', format: 'binary' }}}}})
  @UseInterceptors(FilesInterceptor('images', 4, createImageUploadOptions(uploadConstans.postDir)))
  @ApiOperation({ summary: "게시글 이미지 업로드" })
  uploadHeaderImage(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuth() auth: AuthRequest,
    @UploadedFiles() files: Express.Multer.File[]) {
      return this.postsService.uploadPostImage(id, auth, files);
  }
}

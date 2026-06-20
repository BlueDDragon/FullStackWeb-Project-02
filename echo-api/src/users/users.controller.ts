import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, Query, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { createImageUploadOptions } from '../common/upload.config';
import { uploadConstants } from '../common/constants';
import { QueryPaginationDto } from '../pagination/query-pagination.dto';
import { UploadImagesDto } from './dto/upload-image.dto';
import { PostsService } from '../posts/posts.service';
import { cleanupOnError } from '../common/upload.util';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  ///
  /// 기본 CRUD
  ///
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "사용자 정보 수정" })
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @CurrentAuth() auth: AuthRequest) {
    return this.usersService.update(id, updateUserDto, auth);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "사용자 삭제" })
  remove(
    @Param('id') id: string,
    @CurrentAuth() auth: AuthRequest) {
    return this.usersService.remove(id, auth);
  }

  ///
  /// 정보 조회
  ///
  @Get(':id/posts')
  @ApiOperation({ summary: "사용자 게시글 목록 조회" })
  getPosts(
    @Param('id') id: string,
    @Query() query: QueryPaginationDto) {
      return this.usersService.getPosts(id, query.page, query.limit);
  }
  
  @Get(':id/media')
  @ApiOperation({ summary: "사용자 미디어 목록 조회" })
  getMedia(
    @Param('id') id: string,
    @Query() query: QueryPaginationDto) {
      return this.usersService.getMedia(id, query.page, query.limit);
  }

  @Get(':id/likes')
  @ApiOperation({ summary: "사용자 좋아요 목록 조회" })
  getLikesByUser(
    @Param('id') id: string,
    @Query() query: QueryPaginationDto) {
    return this.usersService.getLikes(id, query.page, query.limit);
  }

  ///
  /// 이미지 업로더
  ///
  @Post('me/profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadImagesDto })
  @UseInterceptors(FileInterceptor('image', createImageUploadOptions(uploadConstants.profileDir)))
  @ApiOperation({ summary: "사용자 프로필 이미지 업로드" })
  uploadProfileImage(
    @CurrentAuth() auth: AuthRequest,
    @UploadedFile() file: Express.Multer.File) {
    return cleanupOnError([file], () => 
      this.usersService.uploadProfileImage(auth, file));
  }

  @Post('me/header-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadImagesDto })
  @UseInterceptors(FileInterceptor('image', createImageUploadOptions(uploadConstants.headerDir)))
  @ApiOperation({ summary: "사용자 헤더 이미지 업로드" })
  uploadHeaderImage(
    @CurrentAuth() auth: AuthRequest,
    @UploadedFile() file: Express.Multer.File) {
    return cleanupOnError([file], () => 
      this.usersService.uploadHeaderImage(auth, file));
  }
}

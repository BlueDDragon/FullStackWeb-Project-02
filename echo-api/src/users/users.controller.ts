import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { createImageUploadOptions } from '../common/upload.config';
import { uploadConstans } from '../common/constants';
import { QueryPaginationDto } from '../pagination/query-pagination.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
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

  @Post('me/profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: {image: {type: "string", format: "binary"}}}})
  @UseInterceptors(FileInterceptor('image', createImageUploadOptions(uploadConstans.profileDir)))
  @ApiOperation({ summary: "사용자 프로필 이미지 업로드" })
  uploadProfileImage(
    @CurrentAuth() auth: AuthRequest,
    @UploadedFile() file: Express.Multer.File) {
      return this.usersService.uploadProfileImage(auth, file);
  }

  @Post('me/header-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: {image: {type: "string", format: "binary"}}}})
  @UseInterceptors(FileInterceptor('image', createImageUploadOptions(uploadConstans.headerDir)))
  @ApiOperation({ summary: "사용자 헤더 이미지 업로드" })
  uploadHeaderImage(
    @CurrentAuth() auth: AuthRequest,
    @UploadedFile() file: Express.Multer.File) {
      return this.usersService.uploadHeaderImage(auth, file);
  }
}

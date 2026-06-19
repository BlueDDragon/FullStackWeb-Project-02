import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBookmarkFolderDto } from './dto/create-bookmark-folder.dto';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';
import { UpdateBookmarkFolderDto } from './dto/update-bookmark-folder.dto';

@ApiTags('BookMark')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "북마크 폴더 작성" })
    createBookmarkFolder(
      @Body() createBookmarkFolderDto: CreateBookmarkFolderDto,
      @CurrentAuth() auth: AuthRequest) {
      return this.bookmarksService.createBookmarkFolder(createBookmarkFolderDto, auth);
    }
  
    @Patch(':folderId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "북마크 폴더 수정" })
    updateBookmarkFolder(
      @Param('folderId') folderId: string, 
      @Body() updateBookmarkFolderDto: UpdateBookmarkFolderDto,
      @CurrentAuth() auth: AuthRequest) {
      return this.bookmarksService.updateBookmarkFolder(folderId, updateBookmarkFolderDto, auth);
    }
  
    @Delete(':folderId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "북마크 폴더 삭제" })
    removeBookmarkFolder(
      @Param('folderId') folderId: string,
      @CurrentAuth() auth: AuthRequest) {
      return this.bookmarksService.removeBookmarkFolder(folderId, auth);
    }
    
    @Post(':folderId/posts/:postId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "북마크" })
    create(
      @Body() createBookmarkDto: CreateBookmarkDto,
      @CurrentAuth() auth: AuthRequest) {
      return this.bookmarksService.createBookmark(createBookmarkDto, auth);
    }
  
    @Delete(':folderId/posts/:postId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "북마크 삭제" })
    remove(
      @Param('folderId') folderId: string,
      @Param('postId', ParseIntPipe) postId: number,
      @CurrentAuth() auth: AuthRequest) {
      return this.bookmarksService.removeBookmark(folderId, postId, auth);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';
import { type AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Like')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "좋아요" })
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentAuth() auth: AuthRequest) {
    return this.likesService.create(postId, auth);
  }
  
  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "좋아요 취소" })
  remove(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentAuth() auth: AuthRequest) {
    return this.likesService.remove(postId, auth);
  }
}

import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_MESSAGES, COMMON_MESSAGES, POST_MESSAGES } from '../common/messages';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import * as bcrypt from 'bcrypt';
import { bcryptConstants } from '../common/constants';
import { POST_ORDERBY } from '../posts/post.select';
import { getImageUploadUrl } from '../common/upload.config';
import { PostsService } from '../posts/posts.service';
import { LikesService } from '../likes/likes.service';
import { getPagination } from '../pagination/pagination';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService,

    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,

    @Inject(forwardRef(() => LikesService))
    private readonly likeService: LikesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.exitsUsername(createUserDto.username);
    await this.exitsEmail(createUserDto.email);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        profileImgUrl: "/profile.png",
        headerImgUrl: "/header.png",
      }
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_USER);
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_USERNAME);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_EMAIL);
    return user;
  }

  async exitsUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username }});
    if (user) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_USERNAME);
  }

  async exitsEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (user) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL);
  }

  async update(id: string, updateUserDto: UpdateUserDto, auth: AuthRequest) {
    if (id !== auth.id) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);
    
    await this.findOne(id);

    if (updateUserDto.username) await this.exitsUsername(updateUserDto.username);

    if (updateUserDto.email) await this.exitsEmail(updateUserDto.email);

    const password = 
      (updateUserDto.password ? 
      await bcrypt.hash(updateUserDto.password, bcryptConstants.round) : updateUserDto.password);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password,
      }
    });

    return { messages: AUTH_MESSAGES.SUCCESS.UPDATE_USER, user: updatedUser };
  }

  async remove(id: string, auth: AuthRequest) {
    if (id !== auth.id) throw new UnauthorizedException(COMMON_MESSAGES.ERROR.UNAUTHORIZED);

    const removedUser = await this.findOne(id);
    await this.prisma.user.delete({ where: { id }});

    return { messages: AUTH_MESSAGES.SUCCESS.DELETE_USER, user: removedUser };
  }

  async getPosts(id: string, page: number = 1, limit: number = 10) {
    return await this.postService.getPostsByUser(id, page, limit);
  }

  async getMedia(id: string, page: number = 1, limit: number = 10) {
    return await this.postService.getMediaByUser(id, page, limit);
  }

  async getLikesByUser(id: string, page: number = 1, limit: number = 10) {
    await this.findOne(id);
    const likes = await this.likeService.findByUser(id, page, limit);
    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, likes: likes }
  }

  async uploadProfileImage(auth: AuthRequest, file: Express.Multer.File) {
    if (!file) throw new BadRequestException(COMMON_MESSAGES.ERROR.BAD_REQUEST);

    const uploadedUser = await this.prisma.user.update({
      where: { id: auth.id },
      data: {
        profileImgUrl: getImageUploadUrl(file),
      }
    });

    const { password, ...result } = uploadedUser;
    return { messages: COMMON_MESSAGES.SUCCESS.UPLOAD, user: result };
  }
  
  async uploadHeaderImage(auth: AuthRequest, file: Express.Multer.File) {
    if (!file) throw new BadRequestException(COMMON_MESSAGES.ERROR.BAD_REQUEST);

    const uploadedUser = await this.prisma.user.update({
      where: { id: auth.id },
      data: {
        headerImgUrl: getImageUploadUrl(file),
      }
    });

    const { password, ...result } = uploadedUser;
    return { messages: COMMON_MESSAGES.SUCCESS.UPLOAD, user: result };
  }
}

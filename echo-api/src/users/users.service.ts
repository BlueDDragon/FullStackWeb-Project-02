import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_MESSAGES, COMMON_MESSAGES, POST_MESSAGES } from '../common/messages';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import * as bcrypt from 'bcrypt';
import { bcryptConstants, domainConstants, portConstants, uploadConstans } from '../common/constants';
import { POST_ORDERBY, POST_SELECT } from '../posts/post.select';
import { getPagination, getTotalPage } from '../pagination/pagination';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
    await this.findOne(id);

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: id },
        select: POST_SELECT, 
        orderBy: POST_ORDERBY.NEWEST, 
        ...getPagination(page, limit)
      }),
      this.prisma.post.count({
        where: { authorId: id },
      })
    ]);
    
    const totalPage = getTotalPage(total, limit);

    // const { password, ...rusult } = user;
    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, /*user: rusult,*/ posts, 
      page, limit, total, totalPage };
  }

  async getMedia(id: string, page: number = 1, limit: number = 10) {
    await this.findOne(id);

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { 
        posts: { 
          select: { images: true }, 
          orderBy: POST_ORDERBY.NEWEST 
        }
      },
    });

    const media: string[] = [];
    user?.posts.forEach(post => post.images.forEach(image => media.push(image.imgUrl)));

    return { messages: POST_MESSAGES.SUCCESS.FIND_POSTS, media: media };
  }

  async uploadProfileImage(auth: AuthRequest, file: Express.Multer.File) {
    if (!file) throw new BadRequestException(COMMON_MESSAGES.ERROR.BAD_REQUEST);

    const filename = `${domainConstants.domain}:${portConstants.port}/${uploadConstans.profileDir}/${file.filename}`;
    const uploadedUser = await this.prisma.user.update({
      where: { id: auth.id },
      data: {
        profileImgUrl: filename,
      }
    });

    const { password, ...rusult } = uploadedUser;
    return { messages: COMMON_MESSAGES.SUCCESS.UPLOAD, user: rusult };
  }
  
  async uploadHeaderImage(auth: AuthRequest, file: Express.Multer.File) {
    if (!file) throw new BadRequestException(COMMON_MESSAGES.ERROR.BAD_REQUEST);

    const filename = `${domainConstants.domain}:${portConstants.port}/${uploadConstans.headerDir}/${file.filename}`;
    const uploadedUser = await this.prisma.user.update({
      where: { id: auth.id },
      data: {
        headerImgUrl: filename,
      }
    });

    const { password, ...rusult } = uploadedUser;
    return { messages: COMMON_MESSAGES.SUCCESS.UPLOAD, user: rusult };
  }
}

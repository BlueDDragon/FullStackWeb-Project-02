import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import * as bcrypt from 'bcrypt';
import { bcryptConstants } from '../common/constants';
import { getImageUploadUrl, removeOldFile, removeOldFiles } from '../common/upload.util';
import { LikesService } from '../likes/likes.service';
import { PostsService } from '../posts/posts.service';
import { USER_SELECT } from './user.select';
import { getPagination, getTotalPage } from '../pagination/pagination';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService,

    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
    
    @Inject(forwardRef(() => LikesService))
    private readonly likeService: LikesService,
  ) {}

  ///
  /// 생성/중복 조회
  ///
  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }});
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username }});
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (!user) throw new NotFoundException();
    return user;
  }

  async existsUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username }});
    if (user) throw new ConflictException();
  }

  async existsEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (user) throw new ConflictException();
  }

  ///
  /// 기본 CRUD
  ///
  async create(createUserDto: CreateUserDto) {
    await this.existsUsername(createUserDto.username);
    await this.existsEmail(createUserDto.email);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        profileImgUrl: "/profile.png",
        headerImgUrl: "/header.png",
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, auth: AuthRequest) {
    if (id !== auth.id) throw new UnauthorizedException();
    
    await this.findOne(id);
    if (updateUserDto.username) await this.existsUsername(updateUserDto.username);
    if (updateUserDto.email) await this.existsEmail(updateUserDto.email);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        ...(updateUserDto.password && 
          { password: await bcrypt.hash(updateUserDto.password, bcryptConstants.round) }),
      }
    });

    const { password, ...result } = updatedUser;
    return { user: result };
  }

  async remove(id: string, auth: AuthRequest) {
    if (id !== auth.id) throw new UnauthorizedException();

    const removedUser = await this.prisma.user.findUnique({
      where: { id },
      include: { posts: {
          include: { images: { select: { imgUrl: true }} }
        }}
    });
    if (!removedUser) throw new NotFoundException();

    await this.prisma.user.delete({ where: { id }});

    const postImgUrls = removedUser.posts.flatMap(post => post.images.map(img => img.imgUrl));
    await Promise.allSettled([
      removeOldFiles(postImgUrls), 
      removeOldFile(removedUser.profileImgUrl), 
      removeOldFile(removedUser.headerImgUrl)
    ]);

    const { password, ...result } = removedUser;
    return { user: result };
  }

  ///
  /// 정보 조회
  ///
  async getPosts(id: string, page: number = 1, limit: number = 10) {
    await this.findOne(id);
    return await this.postService.getPostsByUser(id, page, limit);
  }

  async getMedia(id: string, page: number = 1, limit: number = 10) {
    await this.findOne(id);
    return await this.postService.getMediaByUser(id, page, limit);
  }

  async getLikes(id: string, page: number = 1, limit: number = 10) {
    await this.findOne(id);
    return await this.likeService.findByUser(id, page, limit);
  }

  ///
  /// 이미지 업로더
  ///
  async uploadProfileImage(auth: AuthRequest, file: Express.Multer.File) {
    if (!file) throw new BadRequestException();

    const prevUser = await this.findOne(auth.id);

    const uploadedUser = await this.prisma.user.update({
      where: { id: auth.id },
      data: {
        profileImgUrl: getImageUploadUrl(file),
      }
    });

    await removeOldFile(prevUser.profileImgUrl);

    const { password, ...result } = uploadedUser;
    return { user: result };
  }
  
  async uploadHeaderImage(auth: AuthRequest, file: Express.Multer.File) {
    if (!file) throw new BadRequestException();

    const prevUser = await this.findOne(auth.id);

    const uploadedUser = await this.prisma.user.update({
      where: { id: auth.id },
      data: {
        headerImgUrl: getImageUploadUrl(file),
      }
    });
    
    await removeOldFile(prevUser.headerImgUrl);

    const { password, ...result } = uploadedUser;
    return { user: result };
  }

  ///
  /// 팔로워/팔로잉 관리
  ///
  async findFollow(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followId: { followerId, followingId }},
    });
    if (!follow) throw new NotFoundException();
    return follow;
  }

  async existsFollow(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followId: { followerId, followingId }},
    });
    if (follow) throw new ConflictException();
  }

  // auth.id → id : 팔로우 생성
  async followUser(id: string, auth: AuthRequest) {
    if (id === auth.id) throw new BadRequestException();

    await this.findOne(id);
    await this.existsFollow(auth.id, id);

    const follow = await this.prisma.follow.create({
      data: {
        followerId: auth.id,
        followingId: id,
      }
    });

    return { follow: follow };
  }

  // followers → id : 나를 팔로우하는 목록
  async getFollowers(id: string, page: number = 1, limit = 10) {
    await this.findOne(id);

    const [followers, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: id },
        select: { follower: { select: USER_SELECT }, },
        ...getPagination(page, limit),
      }),
      this.prisma.follow.count({
        where: { followingId: id }
      }),
    ]);
    
    const totalPage = getTotalPage(total, limit);

    return { followers: followers.map(f => f.follower), 
      pagination: { page, limit, total, totalPage }};
  }

  // id → follwings : 내가 팔로우하는 목록
  async getFollowings(id: string, page: number = 1, limit = 10) {
    await this.findOne(id);

    const [followings, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: id },
        select: { following: { select: USER_SELECT } },
        ...getPagination(page, limit),
      }),
      this.prisma.follow.count({
        where: { followerId: id }
      }),
    ]);

    const totalPage = getTotalPage(total, limit);

    return { followings: followings.map(f => f.following), 
      pagination: { page, limit, total, totalPage }};
  }

  // auth.id → id : 내가 팔로우하는 대상 삭제
  async unfollowUser(id: string, auth: AuthRequest) {
    const follow = await this.findFollow(auth.id, id);
    await this.prisma.follow.delete({
      where: { followId: { followerId: auth.id, followingId: id }},
    });
    return { removed: follow };
  }

  // id → auth.id : 나를 팔로우하는 대상 삭제
  async removeFollow(id: string, auth: AuthRequest) {
    const follow = await this.findFollow(id, auth.id);
    await this.prisma.follow.delete({
      where: { followId: { followerId: id, followingId: auth.id }},
    });
    return { removed: follow };
  }
}

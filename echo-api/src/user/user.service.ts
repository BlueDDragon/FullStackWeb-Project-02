import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AUTH_MESSAGES } from '../messages/auth.messages';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const exitUserId = await this.prisma.user.findUnique({ where: { userId: createUserDto.userId }});
    if (exitUserId) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_ID, createUserDto.userId);
    
    const exitEmail = await this.prisma.user.findUnique({ where: { email: createUserDto.email }});
    if (exitEmail) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL, createUserDto.email);

    const passwordHash = await bcrypt.hash(createUserDto.password, Number(process.env.BCRYPT_ROUND) || 10);
    const data = { ...createUserDto, password: passwordHash };
    const { password, ...result } = await this.prisma.user.create({ data: data });

    return { messages: AUTH_MESSAGES.SUCCESS.REGISTER, user: result };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return { messages: AUTH_MESSAGES.SUCCESS.FIND_USERS, users };
  }

  async findOne(userId) {
    const user = await this.prisma.user.findUnique({ where: { userId: userId }});
    if (!user) throw new NotFoundException(`존재하지 않는 userId(${userId})입니다.`);

    const { password, ...result } = user;
    return { messages: AUTH_MESSAGES.SUCCESS.FIND_USER, user: result };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await this.findOne(userId);

    if (updateUserDto.email) {
      const exitEmail = await this.prisma.user.findUnique({ where: { email: updateUserDto.email }});
      if (exitEmail) throw new ConflictException(`중복된 email(${updateUserDto.email})입니다.`);
    }

    const { password, ...result } = await this.prisma.user.update({ where: { userId: userId }, data: updateUserDto });
    return { messages: AUTH_MESSAGES.SUCCESS.UPDATE_USER, user: result };
  }

  async remove(userId: string) {
    const removedUser = await this.findOne(userId);
    await this.prisma.user.delete({ where: { userId: userId }});

    return { messages: AUTH_MESSAGES.SUCCESS.DELETE_USER, user: removedUser };
  }
}

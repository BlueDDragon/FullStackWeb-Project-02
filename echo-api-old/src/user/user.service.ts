import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AUTH_MESSAGES } from '../messages/auth.messages';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: string, username: string, email: string, password: string }) {
    const exitUserId = await this.prisma.user.findUnique({ where: { userId: data.userId }});
    if (exitUserId) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_ID, data.userId);
    
    const exitEmail = await this.prisma.user.findUnique({ where: { email: data.email }});
    if (exitEmail) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL, data.email);

    const passwordHash = await bcrypt.hash(data.password, Number(process.env.BCRYPT_ROUND) || 10);
    const { password, ...result } = await this.prisma.user.create({ data: { ...data, password: passwordHash } });

    return { messages: AUTH_MESSAGES.SUCCESS.REGISTER, user: result };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return { messages: AUTH_MESSAGES.SUCCESS.FIND_USERS, users };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_ID, id);

    const { password, ...result } = user;
    return { messages: AUTH_MESSAGES.SUCCESS.FIND_USER, user: result };
  }

  // include: password
  async findByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { userId: userId }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_ID, userId);

    return { messages: AUTH_MESSAGES.SUCCESS.FIND_USER, user: user };
  }

  // include: password
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_EMAIL, email);

    return { messages: AUTH_MESSAGES.SUCCESS.FIND_USER, user: user };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.email) {
      const exitEmail = await this.prisma.user.findUnique({ where: { email: updateUserDto.email }});
      if (exitEmail) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL, updateUserDto.email);
    }

    const { password, ...result } = await this.prisma.user.update({ where: { id: id }, data: updateUserDto });
    return { messages: AUTH_MESSAGES.SUCCESS.UPDATE_USER, user: result };
  }

  async remove(id: string) {
    const removedUser = await this.findOne(id);
    await this.prisma.user.delete({ where: { id: id }});

    return { messages: AUTH_MESSAGES.SUCCESS.DELETE_USER, user: removedUser };
  }
}

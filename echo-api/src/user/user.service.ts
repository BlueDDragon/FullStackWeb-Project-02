import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const exitUserId = await this.prisma.user.findUnique({ where: { userId: createUserDto.userId }});
    if (exitUserId) throw new ConflictException(`중복된 userId(${createUserDto.userId})입니다.`);
    
    const exitEmail = await this.prisma.user.findUnique({ where: { email: createUserDto.email }});
    if (exitEmail) throw new ConflictException(`중복된 email(${createUserDto.email})입니다.`);

    const passwordHash = await bcrypt.hash(createUserDto.password, Number(process.env.BCRYPT_ROUND) || 10);
    const data = { ...createUserDto, password: passwordHash };
    const { password, ...result } = await this.prisma.user.create({ data: data });

    return { user: result };
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(userId) {
    const user = await this.prisma.user.findUnique({ where: { userId: userId }});
    if (!user) throw new NotFoundException(`존재하지 않는 userId(${userId})입니다.`);

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const exitEmail = await this.prisma.user.findUnique({ where: { email: updateUserDto.email }});
      if (exitEmail) throw new ConflictException(`중복된 email(${updateUserDto.email})입니다.`);
    }

    const user = await this.findOne(userId);

    return this.prisma.user.update({ where: { userId: userId }, data: updateUserDto });
  }

  async remove(userId: string) {
    const user = await this.findOne(userId);
    await this.prisma.user.delete({ where: { userId: userId }});

    return user;
  }
}

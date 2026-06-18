import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_MESSAGES } from '../messages';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const exitsUsername = await this.findByUsername(createUserDto.username);
    if (exitsUsername) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_USERNAME, createUserDto.username);

    const exitsEmail = await this.findByEmail(createUserDto.email);
    if (exitsEmail) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL, createUserDto.email);

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
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_USER);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (!user) throw new NotFoundException(AUTH_MESSAGES.ERROR.NOT_FOUND_USER);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.username) {
      const exitsUsername = await this.findByUsername(updateUserDto.username);
      if (exitsUsername) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_USERNAME, updateUserDto.username); 
    }

    if (updateUserDto.email) {
      const exitsEmail = await this.findByEmail(updateUserDto.email);
      if (exitsEmail) throw new ConflictException(AUTH_MESSAGES.ERROR.CONFLICT_EMAIL, updateUserDto.email);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.prisma.user.delete({ where: { id }});

    return user;
  }
}

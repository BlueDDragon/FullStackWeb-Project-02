import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const exitId = await this.prisma.user.findUnique({ where: { id: createUserDto.id }});
    if (exitId) throw new ConflictException(`중복된 id(${createUserDto.id})입니다.`);
    
    const exitEmail = await this.prisma.user.findUnique({ where: { email: createUserDto.email }});
    if (exitEmail) throw new ConflictException(`중복된 email(${createUserDto.email})입니다.`);

    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id }});
    if (!user) throw new NotFoundException(`존재하지 않는 id(${id})입니다.`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const exitEmail = await this.prisma.user.findUnique({ where: { email: updateUserDto.email }});
    if (exitEmail) throw new ConflictException(`중복된 email(${updateUserDto.email})입니다.`);

    const user = await this.findOne(id);

    return this.prisma.user.update({ where: { id: id }, data: updateUserDto });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.prisma.user.delete({ where: { id: id }});

    return user;
  }
}

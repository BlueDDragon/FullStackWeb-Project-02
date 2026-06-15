import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("user")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "사용자 등록" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "사용자 목록" })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: "사용자 조회" })
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: "사용자 수정" })
  update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: "사용자 삭제" })
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}

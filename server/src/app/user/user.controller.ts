import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  findOneById(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.userService.findOneById(userId);
  }

  //NOTE: Trim tat ca space du lieu gui len
  @Post()
  create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.userService.create(createUserDto);
  }
}

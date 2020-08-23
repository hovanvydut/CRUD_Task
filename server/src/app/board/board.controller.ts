import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Body,
  Delete,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { Board } from './entity/board.entity';
import { GetCurrentUser } from '../user/decorator/get-current-user.decorator';
import { CreateBoardDto } from './dto/create-board.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ICurrentUser } from '../user/interface/current-user.interface';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(
    @Body(ValidationPipe) createBoardDto: CreateBoardDto,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<void> {
    return this.boardService.create(currentUser.userId, createBoardDto);
  }

  @Get()
  findAll(@GetCurrentUser() currentUser: ICurrentUser): Promise<Board[]> {
    return this.boardService.findAll(currentUser);
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<Board> {
    return this.boardService.findOne(id, currentUser);
  }

  @Patch(':id')
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<UpdateResult> {
    return this.boardService.updateById(id, updateBoardDto, currentUser);
  }

  @Delete(':id')
  deleteById(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<DeleteResult> {
    return this.boardService.deleteById(id, currentUser);
  }
}

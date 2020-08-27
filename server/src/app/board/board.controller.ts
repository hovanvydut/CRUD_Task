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
  ParseArrayPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { Board } from './entity/board.entity';
import { GetCurrentUser } from '../user/decorator/get-current-user.decorator';
import { CreateBoardDto } from './dto/create-board.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ICurrentUser } from '../user/interface/current-user.interface';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from '../user/entity/user.entity';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  //NOTE: Check trùng tên board của cùng 1 user, trim space of nameBoard
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

  @Get(':boardId')
  findById(
    @Param('boardId', ParseIntPipe) boardId: number,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<Board> {
    return this.boardService.findOneById(boardId, currentUser);
  }

  @Patch(':boardId')
  updateById(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<UpdateResult> {
    return this.boardService.updateById(boardId, updateBoardDto, currentUser);
  }

  @Delete(':boardId')
  deleteById(
    @Param('boardId', ParseIntPipe) boardId: number,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<DeleteResult> {
    return this.boardService.deleteById(boardId, currentUser);
  }

  //NOTE them member vao board
  @Post(':boardId/members')
  addMembers(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body('usernames', ParseArrayPipe)
    usernames: string[],
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<void> {
    return this.boardService.addMembers(boardId, usernames, currentUser);
  }

  /*NOTE 
    @ boardId co ton tai khong?
    @ user hien tai co so huu boardId do khong?
  */
  @Get(':boardId/members')
  getMembers(
    @Param('boardId', ParseIntPipe) boardId: number,
    @GetCurrentUser() currentUser: ICurrentUser,
  ): Promise<User[]> {
    return this.boardService.getMembers(boardId, currentUser);
  }
}

import { Injectable } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { Board } from './entity/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ICurrentUser } from '../user/interface/current-user.interface';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  create(
    authorIdOfBoard: number,
    createBoardDto: CreateBoardDto,
  ): Promise<void> {
    return this.boardRepository.createBoard(authorIdOfBoard, createBoardDto);
  }

  findAll(currentUser: ICurrentUser): Promise<Board[]> {
    return this.boardRepository.findAllByAuthor(currentUser.userId);
  }

  findOne(id: number, currentUser: ICurrentUser): Promise<Board> {
    return this.boardRepository.findOneByIdAndAuthor(id, currentUser.userId);
  }

  async updateById(
    id: number,
    updateBoardDto: UpdateBoardDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResult> {
    return this.boardRepository.updateById(
      id,
      updateBoardDto,
      currentUser.userId,
    );
  }

  deleteById(id: number, currentUser: ICurrentUser): Promise<DeleteResult> {
    return this.boardRepository.deleteById(id, currentUser.userId);
  }
}

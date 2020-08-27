import {
  EntityRepository,
  Repository,
  InsertResult,
  DeleteResult,
} from 'typeorm';
import { Board } from './entity/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    authorIdOfBoard: number,
    createBoardDto: CreateBoardDto,
  ): Promise<void> {
    const insertResult: InsertResult = await this.insert(createBoardDto);
    return this.createQueryBuilder()
      .relation(Board, 'author')
      .of(insertResult.identifiers[0].id)
      .set(authorIdOfBoard);
  }

  findAllByAuthor(authorId: number) {
    return this.createQueryBuilder()
      .where({ author: authorId })
      .getMany();
  }

  findOneByIdAndAuthor(boardId: number, authorId: number): Promise<Board> {
    return this.createQueryBuilder()
      .where({ id: boardId, author: authorId })
      .getOne();
  }

  updateById(
    boardId: number,
    updateBoardDto: UpdateBoardDto,
    authorId: number,
  ) {
    return this.createQueryBuilder()
      .update()
      .set(updateBoardDto)
      .where({ id: boardId, author: authorId })
      .execute();
  }

  deleteById(boardId: number, authorId: number): Promise<DeleteResult> {
    return this.createQueryBuilder()
      .delete()
      .where({ id: boardId, author: authorId })
      .execute();
  }

  addMembers(boardId: number, memberIds: number[]) {
    return this.createQueryBuilder()
      .relation(Board, 'members')
      .of(boardId)
      .add(memberIds);
  }
}

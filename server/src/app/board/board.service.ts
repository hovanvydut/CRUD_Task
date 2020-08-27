import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { Board } from './entity/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ICurrentUser } from '../user/interface/current-user.interface';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import {
  NOT_EXIST_BOARD_MESSAAGE,
  NOT_PERMISSION_MESSAGE,
} from 'src/common/constant/error-message.constant';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userService: UserService,
  ) {}

  //NOTE: setmember cho authorId
  create(
    authorIdOfBoard: number,
    createBoardDto: CreateBoardDto,
  ): Promise<void> {
    return this.boardRepository.createBoard(authorIdOfBoard, createBoardDto);
  }

  findAll(currentUser: ICurrentUser): Promise<Board[]> {
    return this.boardRepository.findAllByAuthor(currentUser.userId);
  }

  async findOneById(
    boardId: number,
    currentUser: ICurrentUser,
  ): Promise<Board> {
    const board: Board = await this.boardRepository.findOne(
      { id: boardId },
      { relations: ['author', 'members'] },
    );

    if (!board) throw new BadRequestException(NOT_EXIST_BOARD_MESSAAGE);
    if (board.author.id !== currentUser.userId)
      throw new ForbiddenException(NOT_PERMISSION_MESSAGE);

    return board;
  }

  async updateById(
    boardId: number,
    updateBoardDto: UpdateBoardDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResult> {
    const board = await this.boardRepository.findOne(boardId, {
      relations: ['author'],
    });

    if (!board) throw new BadRequestException(NOT_EXIST_BOARD_MESSAAGE);
    if (board.author.id !== currentUser.userId)
      throw new ForbiddenException(NOT_PERMISSION_MESSAGE);

    return this.boardRepository.updateById(
      boardId,
      updateBoardDto,
      currentUser.userId,
    );
  }

  deleteById(
    boardId: number,
    currentUser: ICurrentUser,
  ): Promise<DeleteResult> {
    return this.boardRepository.deleteById(boardId, currentUser.userId);
  }

  /* NOTE
    @ xem boardId co ton tai
    @ chi own cua boardId or admin moi duoc addMemeber
    @ kiem tra nhung user co memberUsername do co ton tai khong
    @ kiem tra nhung memberUsernames da ton tai trong member chua, neu chua thi add vao members
  */
  async addMembers(
    boardId: number,
    memberUsernames: string[],
    currentUser: ICurrentUser,
  ): Promise<void> {
    const board: Board = await this.boardRepository.findOne(
      { id: boardId },
      { relations: ['author', 'members'] },
    );

    if (!board) throw new BadRequestException(NOT_EXIST_BOARD_MESSAAGE);
    if (board.author.id !== currentUser.userId)
      throw new ForbiddenException(NOT_PERMISSION_MESSAGE);

    const users: User[] = await Promise.all(
      memberUsernames.map(username =>
        this.userService.findOne({ username }, { select: ['id'] }),
      ),
    );

    // Lọc ra những username tồn tại trong db
    const addMemberIds: number[] = users
      .filter(user => user && user.id)
      .map(user => user.id);

    console.log('here', addMemberIds);
    const existedMembers: User[] = await this.getMembers(boardId, currentUser);

    console.log(existedMembers);
    if (existedMembers.length > 1) {
      const existedMemberIds: number[] = existedMembers.map(
        member => member.id,
      );
      const notMemberId: number[] = addMemberIds.filter(
        id => existedMemberIds.indexOf(id) == -1,
      );

      return this.boardRepository.addMembers(boardId, notMemberId);
    }

    return this.boardRepository.addMembers(boardId, addMemberIds);
  }

  //NOTE Chi co author cua board moi dung dc
  async getMembers(
    boardId: number,
    currentUser: ICurrentUser,
  ): Promise<User[]> {
    const board: Board = await this.boardRepository.findOne(
      { id: boardId },
      { relations: ['author', 'members'] },
    );

    if (!board) throw new BadRequestException(NOT_EXIST_BOARD_MESSAAGE);
    if (board.author.id !== currentUser.userId)
      throw new ForbiddenException(NOT_PERMISSION_MESSAGE);

    const doc = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.members', 'user')
      .where('board.id = :id', { id: boardId })
      .getOne();

    return doc.members;
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/app/user/entity/user.entity';
import { Board } from 'src/app/board/entity/board.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: number;

  @ManyToOne(
    type => Board,
    board => board.tasks,
  )
  board: Board;

  @ManyToMany(type => User)
  @JoinTable()
  members: User[];
}

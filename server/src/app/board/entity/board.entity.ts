import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Task } from 'src/app/task/entity/task.entity';
import { User } from 'src/app/user/entity/user.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    type => User,
    user => user.boards,
  )
  author: User;

  @ManyToMany(type => User)
  @JoinTable()
  members: User[];

  @OneToMany(
    type => Task,
    task => task.board,
  )
  tasks: Task[];
}

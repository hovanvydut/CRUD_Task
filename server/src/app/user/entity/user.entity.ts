import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { Board } from 'src/app/board/entity/board.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(
    type => Board,
    board => board.author,
    {
      nullable: true,
    },
  )
  boards: Board[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  lastest_update_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

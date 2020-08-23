import { Module } from '@nestjs/common';
import { UserModule } from 'src/app/user/user.module';
import { TaskModule } from 'src/app/task/task.module';
import { BoardModule } from 'src/app/board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/app/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:123456@localhost/CRUD_Task',
      entities: ['dist/**/*.entity{ .ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    TaskModule,
    BoardModule,
    AuthModule,
  ],
})
export class AppModule {}

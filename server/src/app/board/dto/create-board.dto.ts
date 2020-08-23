import { MinLength } from 'class-validator';

export class CreateBoardDto {
  @MinLength(1)
  name: string;
}

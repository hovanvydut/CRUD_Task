import { MinLength } from 'class-validator';

export class UpdateBoardDto {
  @MinLength(1)
  name: string;
}

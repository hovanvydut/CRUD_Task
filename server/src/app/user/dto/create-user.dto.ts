import { MinLength } from 'class-validator';
import {
  INVALID_USERNAME_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
} from 'src/common/constant/error-message.constant';

export class CreateUserDto {
  @MinLength(6, { message: INVALID_USERNAME_MESSAGE })
  username: string;

  @MinLength(6, { message: INVALID_PASSWORD_MESSAGE })
  password: string;
}

import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { EXIST_USERNAME_MSG } from 'src/common/constant/error-message.constant';
import { User } from './entity/user.entity';
import { InsertResult } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private logger = new Logger();
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);

    try {
      await this.userRepository.insert(createUserDto);
    } catch (error) {
      this.logger.error(error.message, null, 'UserService');
      if (error.code === '23505') {
        throw new ConflictException(EXIST_USERNAME_MSG);
      }

      throw new InternalServerErrorException();
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  findOne(option: object) {
    return this.userRepository.findOne(option);
  }
}

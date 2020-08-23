import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    // @nestjs/jwt based on jsonwebtoken package
    private readonly jwtService: JwtService,
  ) {}

  // check if the user exists
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      // create token, sign method is the same sign method in jsonwebtoken package
      access_token: this.jwtService.sign(payload),
    };
  }
}

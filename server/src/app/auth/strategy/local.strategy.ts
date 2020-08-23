import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // option object of jwt strategy
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  // verify function
  async validate(username: string, password: string): Promise<any> {
    // check if the user exists with given username, password
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Passport automatically creates a user object, based on the value we return from the validate() method, and assigns it to the Request object as req.user
    return user;
  }
}

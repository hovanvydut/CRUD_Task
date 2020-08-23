import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from 'src/common/constant/jwt.constant';
/* 
  @ For the jwt-strategy, Passport first verifies the JWT's signature and decodes the JSON. 
  @ It then invokes our validate() method passing the decoded JSON as its single parameter. 
  @ Based on the way JWT signing works, we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // option object
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // will add some further logic here
    return { userId: payload.sub, username: payload.username };
  }
}

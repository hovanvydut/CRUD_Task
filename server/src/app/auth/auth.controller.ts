import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // AuthGuard that @nestjs/passportautomatically provisioned for us when we extended the passport-local strategy
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    // if user  is valid, sign and issue a token
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }
}

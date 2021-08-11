import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  // 로그인을 담당할 Router 구현하기
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<void> {
    return req.user;
  }
}

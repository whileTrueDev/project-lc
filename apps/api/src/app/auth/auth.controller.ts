import { Controller, Get, Post, Req, Body, UseGuards, Res, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginToken } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 최초 로그인을 담당할 Router 구현하기
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body('stayLogedIn') stayLogedIn: boolean,
    @Query('type') userType: 'seller' | 'creator',
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user }: any = req;
    const loginToken: LoginToken = this.authService.issueToken(
      user,
      stayLogedIn,
      userType,
    );
    // response 객체 설정
    res.cookie('refresh_token', loginToken.refresh_token, {
      httpOnly: true,
      maxAge: loginToken.refresh_token_expires_in,
    });
    res.status(200).send(loginToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // 요청 객체의 user로 들어가게 된다.
    return req.user;
  }
}

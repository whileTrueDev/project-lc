import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  Body,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { COOKIE_AUO_LOGIN_EXPIRE_TIME, COOKIE_EXPIRE_TIME } from './auth.constant';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 최초 로그인을 담당할 Router 구현하기
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body('stayLogedIn') stayLogedIn: boolean,
    @Request() req: express.Request,
    @Response() res: express.Response,
  ): Promise<void> {
    const { user }: any = req;
    const { accessToken, refreshToken } = await this.authService.login(user, stayLogedIn);
    const ageTime: number = stayLogedIn
      ? COOKIE_AUO_LOGIN_EXPIRE_TIME
      : COOKIE_EXPIRE_TIME;
    // Set-Cookie 헤더로 refresh_token을 담은 HTTP Only 쿠키를 클라이언트에 심는다.
    res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: ageTime });
    res.send({ access_token: accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // 요청 객체의 user로 들어가게 된다.
    return req.user;
  }
}

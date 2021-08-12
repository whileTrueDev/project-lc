import { Controller, Delete, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SocialService } from './social.service';
@Controller('auth/social')
export class SocialController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialService: SocialService,
  ) {}

  private readonly frontMypageUrl = 'http://localhost:3000/'; // TODO: front mypage로 리다이렉션

  /** 구글 ************************************************ */
  @Get('/google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return req.user;
  }

  @Delete('/google/unlink/:googleId')
  async googleUnlink(@Param('googleId') googleId: string) {
    return this.socialService.googleUnlink(googleId);
  }

  /** 네이버 ************************************************ */
  @Get('/naver/login')
  @UseGuards(AuthGuard('naver'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async naverAuth() {}

  @Get('/naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return req.user;
  }

  @Delete('/naver/unlink/:naverId')
  async naverUnlink(@Param('naverId') naverId: string) {
    return this.socialService.naverUnlink(naverId);
  }

  /** 카카오 ************************************************ */
  @Get('/kakao/login')
  @UseGuards(AuthGuard('kakao'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async kakaoAuth() {}

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return req.user;
  }

  @Delete('/kakao/unlink/:kakaoId')
  async kakaoUnlink(@Param('kakaoId') kakaoId: string) {
    return this.socialService.kakaoUnlink(kakaoId);
  }
}

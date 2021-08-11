import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Controller('auth/social')
export class SocialController {
  constructor(private readonly authService: AuthService) {}
  private readonly frontMypageUrl = 'http://localhost:3000/'; // TODO: front mypage로 리다이렉션

  /** 구글 로그인 ************************************************ */
  @Get('/google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.redirect(this.frontMypageUrl);
  }

  /** 네이버 로그인 ************************************************ */
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
    res.redirect(this.frontMypageUrl);
  }

  /** 카카오 로그인 ************************************************ */
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
    res.redirect(this.frontMypageUrl);
  }
}

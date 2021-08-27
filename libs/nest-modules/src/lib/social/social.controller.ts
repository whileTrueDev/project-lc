import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { SocialService } from './social.service';
import { SocialLoginExceptionFilter } from './social-login-exception.filter';
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  private readonly frontMypageUrl = 'http://localhost:4200/mypage';

  /** email 로 가입된 셀러에 연동된 소셜계정목록 반환 */
  @UseGuards(JwtAuthGuard)
  @Get('/accounts')
  async getSocialAccounts(@Query('email') email: string) {
    return this.socialService.getSocialAccounts(email);
  }

  /** 구글 ************************************************ */
  @Get('/google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  @UseFilters(new SocialLoginExceptionFilter())
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    this.socialService.login(req, res);
    res.redirect(this.frontMypageUrl);
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
  @UseFilters(new SocialLoginExceptionFilter())
  async naverAuthCallback(@Req() req: Request, @Res() res: Response) {
    this.socialService.login(req, res);
    res.redirect(this.frontMypageUrl);
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
  @UseFilters(new SocialLoginExceptionFilter())
  async kakaoAuthCallback(@Req() req: Request, @Res() res: Response) {
    this.socialService.login(req, res);
    res.redirect(this.frontMypageUrl);
  }

  @Delete('/kakao/unlink/:kakaoId')
  async kakaoUnlink(@Param('kakaoId') kakaoId: string) {
    return this.socialService.kakaoUnlink(kakaoId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SocialAccounts, UserType, USER_TYPE_KEY } from '@project-lc/shared-types';
import { getBroadcasterWebHost, getWebHost } from '@project-lc/utils';
import { getUserTypeFromRequest } from '@project-lc/utils-backend';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { LoginHistoryService } from '../auth/login-history/login-history.service';
import { SocialService } from './social.service';
@Controller('social')
export class SocialController {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
    private readonly socialService: SocialService,
  ) {}

  /** 소셜로그인 userType에 따른 마이페이지 주소 리턴 */
  private getFrontMypageUrl(userType: UserType): string {
    let hostUrl: string;
    if (userType === 'broadcaster') {
      hostUrl = getBroadcasterWebHost();
    } else {
      hostUrl = getWebHost();
    }
    return `${hostUrl}/mypage`;
  }

  /** email 로 가입된 셀러에 연동된 소셜계정목록 반환 */
  @UseGuards(JwtAuthGuard)
  @Get('/accounts')
  async getSocialAccounts(
    @Query('userType') userType: UserType,
    @Query('email') email: string,
  ): Promise<SocialAccounts> {
    return this.socialService.getSocialAccounts(userType, email);
  }

  /** 구글 ************************************************ */
  @Get('/google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(): Promise<void> {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    const userType: UserType = getUserTypeFromRequest(req);
    const isLogin = this.socialService.login(userType, req, res);

    if (isLogin === 'inactive') {
      // 휴면계정 처리
    }

    // 로그인 기록 추가 by @hwasurr
    this.loginHistoryService.createLoginStamp(req, '소셜/구글');

    res.clearCookie(USER_TYPE_KEY);
    return res.redirect(this.getFrontMypageUrl(userType));
  }

  @Delete('/google/unlink/:serviceId')
  async googleUnlink(
    @Param('serviceId') serviceId: string,
    @Body('userType') userType: UserType,
  ): Promise<boolean> {
    await this.socialService.googleUnlink(userType, serviceId);
    return this.socialService.deleteSocialAccountRecord(userType, serviceId);
  }

  /** 네이버 ************************************************ */
  @Get('/naver/login')
  @UseGuards(AuthGuard('naver'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async naverAuth(): Promise<void> {}

  @Get('/naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    const userType: UserType = getUserTypeFromRequest(req);
    this.socialService.login(userType, req, res);

    // 로그인 기록 추가 by @hwasurr
    this.loginHistoryService.createLoginStamp(req, '소셜/네이버');

    res.clearCookie(USER_TYPE_KEY);
    return res.redirect(this.getFrontMypageUrl(userType));
  }

  @Delete('/naver/unlink/:serviceId')
  async naverUnlink(
    @Param('serviceId') serviceId: string,
    @Body('userType') userType: UserType,
  ): Promise<boolean> {
    await this.socialService.naverUnlink(userType, serviceId);
    return this.socialService.deleteSocialAccountRecord(userType, serviceId);
  }

  /** 카카오 ************************************************ */
  @Get('/kakao/login')
  @UseGuards(AuthGuard('kakao'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async kakaoAuth(): Promise<void> {}

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    const userType: UserType = getUserTypeFromRequest(req);
    this.socialService.login(userType, req, res);

    // 로그인 기록 추가 by @hwasurr
    this.loginHistoryService.createLoginStamp(req, '소셜/카카오');

    res.clearCookie(USER_TYPE_KEY);
    return res.redirect(this.getFrontMypageUrl(userType));
  }

  @Delete('/kakao/unlink/:serviceId')
  async kakaoUnlink(
    @Param('serviceId') serviceId: string,
    @Body('userType') userType: UserType,
  ): Promise<boolean> {
    await this.socialService.kakaoUnlink(userType, serviceId);
    return this.socialService.deleteSocialAccountRecord(userType, serviceId);
  }
}

import {
  BadRequestException,
  Body,
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
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  NEXT_PAGE_PARAM_KEY,
  SocialAccounts,
  UserType,
  USER_TYPE_KEY,
} from '@project-lc/shared-types';
import { getBroadcasterWebHost, getCustomerWebHost, getWebHost } from '@project-lc/utils';
import { getUserTypeFromRequest } from '@project-lc/utils-backend';
import { Request, Response } from 'express';
import {
  LoginHistoryService,
  LoginMethods,
} from '../auth/login-history/login-history.service';
import { SocialLoginExceptionFilter } from './social-login-exception.filter';
import { SocialService } from './social.service';

@Controller('social')
@UseFilters(SocialLoginExceptionFilter)
export class SocialController {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
    private readonly socialService: SocialService,
  ) {}

  /** email 로 가입된 사용자에 연동된 소셜계정목록 반환 */
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
    return this.handleSocialCallback({ req, res, loginMethod: '소셜/구글' });
  }

  /** 구글 계정 연동 해제 */
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
    return this.handleSocialCallback({ req, res, loginMethod: '소셜/네이버' });
  }

  /** 네이버 계정 연동 해제 */
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
    return this.handleSocialCallback({ req, res, loginMethod: '소셜/카카오' });
  }

  /** 카카오 계정 연동 해제 */
  @Delete('/kakao/unlink/:serviceId')
  async kakaoUnlink(
    @Param('serviceId') serviceId: string,
    @Body('userType') userType: UserType,
  ): Promise<boolean> {
    await this.socialService.kakaoUnlink(userType, serviceId);
    return this.socialService.deleteSocialAccountRecord(userType, serviceId);
  }

  /** 소셜로그인 콜백 핸들링 */
  private async handleSocialCallback(opts: {
    req: Request;
    res: Response;
    loginMethod: LoginMethods;
  }): Promise<void> {
    const { req, res, loginMethod } = opts;

    // 소셜로그인 시 SocialLoginUserTypeMiddleware를 통해 쿠키에 추가된 userType 확인
    const userType: UserType = getUserTypeFromRequest(req);
    if (!userType) throw new BadRequestException('userType cookie must be defined');

    const userPayload = this.socialService.login(userType, req, res);
    const { nextpage } = req.cookies;
    const hostUrl = this.getFrontUrl(userType);

    if (userPayload.inactiveFlag) {
      // 휴면계정 처리
      return res.redirect(`${hostUrl}/activate?type=social&email=${userPayload.sub}`);
    }
    // 로그인 기록 생성
    this.loginHistoryService.createLoginStamp(req, loginMethod);

    // 로그인 이후 userType쿠키 삭제
    res.clearCookie(USER_TYPE_KEY);
    res.clearCookie(NEXT_PAGE_PARAM_KEY);
    if (userType === 'customer') return res.redirect(hostUrl + (nextpage || ''));
    return res.redirect(`${hostUrl}/mypage`);
  }

  /** 소셜로그인 userType에 따른 마이페이지 주소(로그인 이후 이동할 페이지) 리턴 */
  private getFrontUrl(userType: UserType): string {
    let hostUrl: string;
    if (userType === 'broadcaster') {
      hostUrl = getBroadcasterWebHost();
    } else if (userType === 'customer') {
      hostUrl = getCustomerWebHost();
    } else {
      hostUrl = getWebHost();
    }
    return hostUrl;
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { UserType } from '@project-lc/shared-types';
import { getBroadcasterWebHost, getCustomerWebHost, getWebHost } from '@project-lc/utils';
import { getUserTypeFromRequest } from '@project-lc/utils-backend';
import { Request, Response } from 'express';
import { SocialService } from './social.service';

@Catch(HttpException)
export class SocialLoginExceptionFilter implements ExceptionFilter {
  constructor(private readonly socialService: SocialService) {}

  /** 소셜로그인 userType에 따른 마이페이지 주소 리턴 */
  private getHostUrl(userType: UserType): string {
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

  /** 소셜로그인 userType에 따른 로그인 페이지 주소 리턴 */
  private getWebLoginPageUrl = (userType: UserType): string => {
    const hostUrl = this.getHostUrl(userType);
    return `${hostUrl}/login`;
  };

  private getLoginErrorRedirectUrl = (
    userType: UserType,
    provider: any,
    message: any,
  ): string => {
    const hostUrl = this.getHostUrl(userType);
    return `${hostUrl}/login?error=true&provider=${provider}&message=${message}`;
  };

  /** exception 과 request.query 값으로 해당 에러가 네이버 동의화면에서 취소 눌러서 발생한 에러인지 확인 */
  private isCanceledOnNaverAgreementPage(exception: any, request: Request): boolean {
    return (
      exception.status === 401 &&
      request.query?.error === 'access_denied' &&
      request.query?.error_description === 'Canceled By User'
    );
  }

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const userType = getUserTypeFromRequest(request);
    const { provider, providerId, accessToken, message } = exception.response;
    const LOGIN_ERROR_REDIRECT_URL = this.getLoginErrorRedirectUrl(
      userType,
      provider,
      message,
    );
    const WEB_LOGIN_PAGE_URL = this.getWebLoginPageUrl(userType);

    switch (provider) {
      case 'kakao': {
        if (exception.status === 403) {
          await this.socialService.kakaoUnlink(providerId, accessToken);
          response.redirect(LOGIN_ERROR_REDIRECT_URL);
          break;
        }
        response.redirect(WEB_LOGIN_PAGE_URL);
        break;
      }
      case 'naver': {
        if (exception.status === 403) {
          await this.socialService.naverUnlink(providerId, accessToken);
          response.redirect(LOGIN_ERROR_REDIRECT_URL);
          break;
        }
        response.redirect(WEB_LOGIN_PAGE_URL);
        break;
      }
      case 'google': {
        if (exception.status === 403) {
          await this.socialService.googleUnlink(userType, providerId, accessToken);
          response.redirect(LOGIN_ERROR_REDIRECT_URL);
          break;
        }
        response.redirect(WEB_LOGIN_PAGE_URL);
        break;
      }
      default: {
        // 네이버 로그인 동의화면에서 '취소' 눌렀을 경우 처리
        // 네이버 로그인이 되지 않아 provider 값이 undefined -> case naver에서 처리할 수 없었음
        if (this.isCanceledOnNaverAgreementPage(exception, request)) {
          response.redirect(WEB_LOGIN_PAGE_URL);
          return;
        }

        response.status(exception.status).json(exception);
      }
    }
  }
}

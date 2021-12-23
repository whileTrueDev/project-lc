import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { getBroadcasterWebHost, getWebHost } from '@project-lc/utils';
import { getUserTypeFromRequest } from '@project-lc/utils-backend';
import { UserType } from '@project-lc/shared-types';
import { SocialService } from './social.service';

@Catch(HttpException)
export class SocialLoginExceptionFilter implements ExceptionFilter {
  constructor(private readonly socialService: SocialService) {}

  private getHostUrl = (userType: UserType): string => {
    let hostUrl: string;
    if (userType === 'seller') {
      // 판매자의 경우
      hostUrl = getWebHost();
    } else {
      // 방송인의 경우
      hostUrl = getBroadcasterWebHost();
    }
    return hostUrl;
  };

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
        response.status(exception.status).json(exception);
      }
    }
  }
}

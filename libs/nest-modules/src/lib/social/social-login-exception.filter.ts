import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { getWebHost } from '@project-lc/utils';
import { SocialService } from './social.service';

const WEB_LOGIN_PAGE_URL = `${getWebHost()}/login`;

@Catch(HttpException)
export class SocialLoginExceptionFilter implements ExceptionFilter {
  constructor(private readonly socialService: SocialService) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { provider, providerId, accessToken, message } = exception.response;

    const LOGIN_ERROR_REDIRECT_URL = `${getWebHost()}/login?error=true&provider=${provider}&message=${message}`;

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
          await this.socialService.googleUnlink(providerId, accessToken);
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

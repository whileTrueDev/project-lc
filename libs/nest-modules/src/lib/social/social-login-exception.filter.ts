import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { SocialService } from './social.service';

@Catch(HttpException)
export class SocialLoginExceptionFilter implements ExceptionFilter {
  constructor(private readonly socialService: SocialService) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { provider, providerId, accessToken, message } = exception.response;

    switch (provider) {
      case 'kakao': {
        if (exception.status === 403) {
          //
          await this.socialService.kakaoUnlink(providerId, accessToken);
          response.redirect(
            `http://localhost:4200/login?error=true&provider=kakao&message=${message}`,
          ); // TODO: 추후 주소 변경
          break;
        }
        response.redirect('http://localhost:4200/login'); // TODO: 추후 주소 변경
        break;
      }
      case 'naver': {
        if (exception.status === 403) {
          await this.socialService.naverUnlink(providerId, accessToken);
          response.redirect(
            `http://localhost:4200/login?error=true&provider=naver&message=${message}`,
          ); // TODO: 추후 주소 변경
          break;
        }
        response.redirect('http://localhost:4200/login'); // TODO: 추후 주소 변경
        break;
      }
      case 'google': {
        if (exception.status === 403) {
          await this.socialService.googleUnlink(providerId, accessToken);
          response.redirect(
            `http://localhost:4200/login?error=true&provider=google&message=${message}`,
          ); // TODO: 추후 주소 변경
          break;
        }
        response.redirect('http://localhost:4200/login'); // TODO: 추후 주소 변경
        break;
      }
      default: {
        // response.redirect('http://localhost:4200/login'); // TODO: 추후 주소 변경

        response.status(exception.status).json(exception);
      }
    }
  }
}

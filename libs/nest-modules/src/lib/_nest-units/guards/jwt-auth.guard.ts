import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Guard에 의해 401로 반환되기 전, 사전 수행하는 함수입니다.
   * 해당 함수에서 Refresh Token을 확인하고 Access Token을 갱신합니다.
   */
  handleRequest(err, user, _, context: ExecutionContext): any {
    let userPayload = user;
    if (err || !user) {
      const req: Request = context.switchToHttp().getRequest<Request>();
      userPayload = this.authService.validateRefreshToken(req);
      if (userPayload) {
        const res: Response = context.switchToHttp().getResponse<Response>();
        this.authService.handleAuthorizationHeader(res, userPayload);
      } else {
        throw err || new UnauthorizedException();
      }
    }
    return userPayload;
  }
}
// ERROR [ExceptionsHandler] Cannot read property 'validateRefreshToken' of undefined

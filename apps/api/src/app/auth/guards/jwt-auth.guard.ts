import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  handleRequest(err, user, _, context: ExecutionContext) {
    let userPayload = user;
    if (err || !user) {
      const req: Request = context.switchToHttp().getRequest<Request>();

      // refreshToken 유효성 체크
      userPayload = this.authService.validateRefreshToken(req);
      if (userPayload) {
        this.authService.handleAuthorizationHeader(req, userPayload);
      } else {
        throw err || new UnauthorizedException();
      }
    }
    return userPayload;
  }
}

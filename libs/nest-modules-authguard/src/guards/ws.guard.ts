import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtHelperService } from '@project-lc/nest-modules-jwt-helper';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelperService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const socket = context.switchToWs().getClient<Socket>();

    // * 액세스 토큰 확인 작업
    const bearerToken = socket.handshake.auth.authorization;
    const userPayload = this.jwtHelper.simpleVerifyAccessToken(bearerToken);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    socket.user = userPayload;

    // 액세스 토큰 만료의 경우
    if (!userPayload) {
      // * 토큰 새로고침 작업
      const user = this.jwtHelper.validateRefreshTokenFromSocket(socket);
      if (user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        socket.user = user;

        return !!user;
      }
    }
    return !!userPayload;
  }
}

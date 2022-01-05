import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtHelperService } from '@project-lc/nest-modules-jwt-helper';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelperService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest<Request>();
    const userPayload = this.jwtHelper.validateRefreshToken(req);
    if (userPayload && userPayload.type === 'admin') return true;
    return false;
  }
}

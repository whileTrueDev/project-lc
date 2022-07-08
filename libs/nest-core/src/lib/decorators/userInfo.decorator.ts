import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../interfaces/auth.interface';

/**
 * 요청으로부터 로그인된 유저 정보 데이터를 가져옵니다.
 * 로그인된 정보가 있는 지 없는지만 판단합니다. 로그인 정보가 없는 경우, UnauthorizedException 오류를 던집니다.
 * 관리자 또한 판매자의 권한을 가질 수 있도록 구현
 * @주의 **UseGaurd(IsAuthGuard) 로 세션이 있는지 확인한 뒤에 사용하여야 더 안전합니다.**
 * @example
 * someControllerMethod(@Marketer() marketerSession: MarketerSession) {}
 * someControllerMethod(@Marketer() { marketerId }: MarketerSession) {}
 */
export const UserInfo = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const userTypes = ['broadcaster', 'admin', 'seller', 'customer'];
  if (request.user && userTypes.includes(request.user.type))
    return request.user as UserPayload;
  throw new UnauthorizedException(
    `no user info in request, user type: ${request.user.type}`,
  );
});

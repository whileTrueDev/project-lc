import { UserType, USER_TYPE_KEY } from '@project-lc/shared-types';
import { Request } from 'express';

/** 백엔드로 들어오는 요청객체를 통해 userType 확인 */
export function getUserTypeFromRequest(req: Request): UserType {
  return req?.cookies[USER_TYPE_KEY];
}

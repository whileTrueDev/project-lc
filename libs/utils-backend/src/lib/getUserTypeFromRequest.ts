import { UserType, USER_TYPE_KEY } from '@project-lc/shared-types';
import { Request } from 'express';

export function getUserTypeFromRequest(req: Request): UserType {
  return req.cookies[USER_TYPE_KEY];
}

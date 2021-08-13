/* eslint-disable camelcase */
import { Seller } from '@prisma/client';

export interface LoginToken {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
}

// token에 들어갈 공통의 데이터 - 로그인 유지시 필요한 데이터
export interface UserPayload {
  sub: string;
}

export type User = Pick<Seller, 'email'>;

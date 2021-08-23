import { Seller } from '@prisma/client';

// token에 들어갈 공통의 데이터 - 로그인 유지시 필요한 데이터
export interface UserPayload {
  sub: string;
  type: UserType;
}

// token에 들어가기 위해 필요한 데이터 추출. - 다른 종류 사용자에 대해서도 사용가능하도록
export type User = Pick<Seller, 'email'>;

export type UserType = 'seller' | 'creator';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { USER_TYPE_KEY } from '@project-lc/shared-types';
import { Request, Response, NextFunction } from 'express';

/** 소셜로그인 시 로그인 시도한 유저 타입을 req.cookie에 저장하기 위한 미들웨어
 * socialModule에 적용함
 *
 * 소셜로그인은 다른 플랫폼에서 인증과정을 거쳐 유저 정보만 특정 callback으로 리턴됨
 * 로컬 로그인과 달리 쿼리스트링으로 로그인한 유저타입을 전달 -> 타 플랫폼 인증과정 진행 전
 * 해당 미들웨어를 통해 res.cookie[user-type] 에 유저타입(seller | creator) 저장
 *
 * 각 passport strategy 에서 passReqToCallback: true 설정시 req 접근가능
 * 유저타입에 따라 알맞은 테이블에서 유저정보 찾기(각 passport strategy - validate 함수 내에서, passReq 어쩌구 true 설정 필요)
 * -> 콜백 라우터에서 유저정보와 유저타입 이용하여 login 처리(토큰발급, 로그인 내역 저장) 후 res.cookie[user-type]삭제
 */
@Injectable()
export class SocialLoginUserTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log('Request...');
    console.log('req.query', req.query);
    if (req.query[USER_TYPE_KEY]) {
      res.cookie(USER_TYPE_KEY, req.query[USER_TYPE_KEY]);
    }

    next();
  }
}

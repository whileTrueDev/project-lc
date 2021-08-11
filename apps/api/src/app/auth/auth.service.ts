import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(user) {
    console.log('토큰발급 & 저장하는 로그인 처리 - 유저정보 : ', { user });
    // TODO: 토큰 발급
    // TODO: 토큰 저장
    return {
      accessToken: '가짜토큰',
      refreshToken: '가짜 리프레시 토큰',
    };
  }
}

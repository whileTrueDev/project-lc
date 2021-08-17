import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // TODO : 로컬로그인 일감 병합 후 수정
  async issueToken(user, stayLogedIn = false, type = 'seller') {
    return {
      token_type: 'bearer',
      access_token: 'some_access_token',
      expires_in: 'ACCESS_TOKEN_EXPIRE_TIME_INT',
      refresh_token: 'some_refresh_token',
      refresh_token_expires_in: 12345,
      scope: 'userType',
    };
  }
}

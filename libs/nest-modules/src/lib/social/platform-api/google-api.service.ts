
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface GoogleAccessTokenRefreshRes {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
}

@Injectable()
export class GoogleApiService {
  private BASE_URL = 'https://oauth2.googleapis.com';
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;
  constructor(private readonly configService: ConfigService) {
    this.CLIENT_ID = configService.get('GOOGLE_CLIENT_ID');
    this.CLIENT_SECRET = configService.get('GOOGLE_CLIENT_SECRET');
  }

  /**
   * * 구글 access_token을 갱신하는 요청을 보냅니다.
   * @param refreshToken 구글 API 리프레시 토큰
   */
  public async refreshAccessToken(refreshToken: string) {
    return axios
      .post<GoogleAccessTokenRefreshRes>(`${this.BASE_URL}/token`, undefined, {
        params: {
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
          refreshToken,
          grant_type: 'refresh_token',
        },
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  /**
   * * 구글 계정 연동 해제 요청을 보냅니다.
   * @param accessToken 유효한 액세스토큰
   */
  public async unlink(accessToken: string) {
    return axios.post(`${this.BASE_URL}/revoke`, undefined, {
      params: {
        token: encodeURI(accessToken),
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    });
  }
}

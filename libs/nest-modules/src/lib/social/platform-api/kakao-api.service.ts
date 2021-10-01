import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface KakaoAccessTokenRefreshRes {
  /** 토큰 타입, bearer로 고정 */
  token_type: 'bearer';
  /** 갱신된 사용자 액세스 토큰 값 */
  access_token: string;
  /** 액세스 토큰 만료 시간(초) */
  expires_in: number;
  /** 갱신된 사용자 리프레시 토큰 값, 기존 리프레시 토큰의 유효기간이 1개월 미만인 경우에만 갱신 */
  refresh_token?: string;
  /** 리프레시 토큰 만료 시간(초) */
  refresh_token_expires_in?: number;
}

@Injectable()
export class KakaoApiService {
  private BASE_URL = 'https://kapi.kakao.com/v1';
  private KAKAO_CLIENT_ID: string;

  constructor(private readonly configService: ConfigService) {
    this.KAKAO_CLIENT_ID = this.configService.get('KAKAO_CLIENT_ID');
  }

  /**
   * * 카카오 토큰을 갱신하는 요청을 보냅니다.
   * 카카오에서는 갱신주기에 따라 리프레시토큰도 함께 갱신됩니다.
   * @param refreshToken 카카오 API 갱신토큰
   */
  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<KakaoAccessTokenRefreshRes> {
    return axios
      .post<KakaoAccessTokenRefreshRes>(
        'https://kauth.kakao.com/oauth/token',
        undefined,
        {
          params: {
            grant_type: 'refresh_token',
            client_id: this.KAKAO_CLIENT_ID,
            refresh_token: refreshToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      )
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  /**
   * * 카카오 계정 연동 해제요청을 보냅니다.
   * @param accessToken 유효한 액세스토큰
   */
  public async unlink(accessToken: string) {
    return axios
      .post(`${this.BASE_URL}/user/unlink`, undefined, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  /**
   * * 프로필 정보 조회
   * --> 프로필 정보 갱신 (로그인마다 프로필 조회하여 바뀐 정보를 변경)
   */
}

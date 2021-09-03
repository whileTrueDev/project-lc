/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface NaverAccessTokenRefreshRes {
  /** 재발급 받은 접근토큰 */
  access_token: string;
  /** 토큰 타입 (bearer) */
  token_type: string;
  /** 접근토큰 유효성 체크 결과 메시지 */
  expires_in: string;
}

@Injectable()
export class NaverApiService {
  private BASE_URL = 'https://nid.naver.com';
  private NAVER_CLIENT_ID: string;
  private NAVER_CLIENT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.NAVER_CLIENT_ID = this.configService.get('NAVER_CLIENT_ID');
    this.NAVER_CLIENT_SECRET = this.configService.get('NAVER_CLIENT_SECRET');
  }

  /**
   * * 네이버 access_token을 갱신하는 요청을 보냅니다.
   * @param refreshToken 네이버 아이디로 로그인 API 갱신 토큰
   */
  public async refreshAccessToken(refreshToken: string) {
    return axios
      .get<NaverAccessTokenRefreshRes>(`${this.BASE_URL}/oauth2.0/token`, {
        params: {
          client_id: this.NAVER_CLIENT_ID,
          client_secret: this.NAVER_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  /**
   * * 네이버 계정 연동 해제 요청을 보냅니다.
   * @param accessToken 유효한 액세스토큰
   * ? naver 문서 -> 따라서 연동 해제를 수행하기 전에 접근토큰의 유효성을 점검하고,
   * ? 5.1의 접근토큰 갱신 과정에 따라 접근토큰을 갱신하는것을 권장합니다.
   * ? "접근토큰의 유효성을 점검" => this.verifyAccessToken 메서드
   */
  public async unlink(accessToken: string) {
    const isValidated = await this.verifyAccessToken(accessToken);
    if (!isValidated) return false;
    return axios
      .get(`${this.BASE_URL}/oauth2.0/token`, {
        params: {
          client_id: this.NAVER_CLIENT_ID,
          client_secret: this.NAVER_CLIENT_SECRET,
          access_token: accessToken,
          grant_type: 'delete',
          service_provider: 'naver',
        },
      })
      .then((res) => res.data?.result === 'success')
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

  /**
   * * 네이버 액세스 토큰을 유효한 지 검증합니다.
   * @param accessToken 검증할 액세스 토큰
   */
  private async verifyAccessToken(accessToken: string) {
    return axios
      .get<{ resultcode: string; message: string }>(
        `https://openapi.naver.com/v1/nid/verify`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((res) => res.data?.message === 'success')
      .catch(() => {
        return false;
      });
  }

  /**
   * * 프로필 정보 조회
   * 프로필 정보 갱신 (로그인마다 프로필 조회하여 바뀐 정보를 변경)
   * naver api 문서 -> "주기적으로 또는 사용자 로그인이 발생할 때마다 프로필 정보를 조회하여 갱신하는것을 권장하고 있습니다."
   */
  // public async getUserProfile(accessToken: string) {
  //   return axios
  //     .get(`https://openapi.naver.com/v1/nid/me`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })
  //     .then((res) => res.data)
  //     .catch((err) => {
  //       console.error(err);
  //       throw err;
  //     });
  // }
}

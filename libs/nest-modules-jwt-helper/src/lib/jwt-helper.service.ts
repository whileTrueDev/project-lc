import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { authConstants, UserPayload } from '@project-lc/nest-core';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { Request, Response } from 'express';
import { Socket } from 'socket.io';

@Injectable()
export class JwtHelperService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cipherService: CipherService,
    private readonly jwtService: JwtService,
  ) {}

  /** 액세스 토큰 생성 */
  createAccessToken(userPayload: UserPayload, expiresIn?: string | number): string {
    const _userPayload = this.castUserPayload(userPayload);
    return this.jwtService.sign(_userPayload, {
      expiresIn: expiresIn ?? authConstants.ACCESS_TOKEN_EXPIRE_TIME,
    });
  }

  /** 리프레시 토큰 생성 */
  createRefreshToken(userPayload: UserPayload, stayLogedIn: boolean): string {
    const refreshToken: string = this.jwtService.sign(userPayload, {
      expiresIn: stayLogedIn
        ? authConstants.AUTO_LOGIN_EXPIRE_TIME
        : authConstants.REFRESH_TOKEN_EXPIRE_TIME,
    });
    const cookieRefreshToken = this.cipherService.encrypt(refreshToken);
    return cookieRefreshToken;
  }

  /**
   * 요청 객체의 쿠키에서 refresh token을 가져와 검증 후, payload를 전달합니다.
   * @param req 요청 객체
   * @param userPayload Token에 저장될 payload
   */
  validateRefreshToken(req: Request): UserPayload {
    const cookieRefreshToken: string | undefined =
      req.cookies[authConstants.REFRESH_TOKEN_HEADER_KEY];
    try {
      // 암호화 미사용시 제거
      const refreshToken = this.cipherService.decrypt(cookieRefreshToken);
      const userPayload = this.jwtService.verify<UserPayload>(refreshToken);
      return this.castUserPayload(userPayload);
    } catch (err) {
      return null;
    }
  }

  /**
   * socket 클라이언트로부터 refresh token을 가져와 검증 후, payload를 전달합니다.
   * @param req 요청 객체
   * @param userPayload Token에 저장될 payload
   */
  validateRefreshTokenFromSocket(socket: Socket): UserPayload {
    const { cookie } = socket.handshake.headers;
    const cookieString = RegExp(`${authConstants.REFRESH_TOKEN_HEADER_KEY}=[^;]+`).exec(
      cookie,
    );
    const refreshToken = decodeURIComponent(
      cookieString ? cookieString.toString().replace(/^[^=]+./, '') : '',
    );
    try {
      const token = this.cipherService.decrypt(refreshToken);
      const userPayload = this.jwtService.verify<UserPayload>(token);
      return this.castUserPayload(userPayload);
    } catch (err) {
      return null;
    }
  }

  /**
   * Access Token의 만료시, 응답 객체에 새로운 Access Token을 헤더에 추가합니다.
   * @param res 응답 객체
   * @param userPayload Token에 저장될 payload
   */
  refreshAndSetAuthorizationHeader(res: Response, userPayload: UserPayload): void {
    const newAccessToken = this.createAccessToken(userPayload);
    this.setAccessTokenHeader(res, newAccessToken);
  }

  setAccessTokenHeader(res: Response, accessToken: string): Response {
    return res.append(authConstants.ACCESS_TOKEN_HEADER_KEY, accessToken);
  }

  setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
    expiresIn: number,
  ): Response {
    return res.cookie(authConstants.REFRESH_TOKEN_HEADER_KEY, refreshToken, {
      httpOnly: true,
      maxAge: expiresIn,
      secure: true,
      sameSite: 'lax',
      domain:
        this.configService.get('NODE_ENV') === 'production'
          ? '.xn--hp4b17xa.com'
          : 'localhost',
    });
  }

  simpleVerifyAccessToken(token: string): UserPayload {
    try {
      let realToken = token;
      if (token.includes('Bearer')) {
        const splited = token.split(' ');
        // eslint-disable-next-line prefer-destructuring
        realToken = splited[1];
      }
      return this.jwtService.verify(realToken);
    } catch (err) {
      return null;
    }
  }

  private castUserPayload(userPayload: UserPayload): UserPayload {
    return {
      id: userPayload.id,
      sub: userPayload.sub,
      type: userPayload.type,
    };
  }
}

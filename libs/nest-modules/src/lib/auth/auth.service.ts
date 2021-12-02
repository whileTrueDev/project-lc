import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { loginUserRes, UserProfileRes, UserType } from '@project-lc/shared-types';
import { Broadcaster, Seller } from '@prisma/client';
import { UserPayload } from './auth.interface';
import { SellerService } from '../seller/seller.service';
import { BroadcasterService } from '../broadcaster/broadcaster.service';
import { CipherService } from './cipher.service';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
  AUTO_LOGIN_EXPIRE_TIME,
  COOKIE_AUTO_LOGIN_EXPIRE_TIME,
  COOKIE_EXPIRE_TIME,
  ACCESS_TOKEN_EXPIRE_TIME_INT,
} from './auth.constant';

@Injectable()
export class AuthService {
  // private를 사용하는 이유는 해당 Service를 내부에서만 사용할 것이기 떄문이다.
  constructor(
    private sellerService: SellerService,
    private broadcasterService: BroadcasterService,
    private jwtService: JwtService,
    private cipherService: CipherService,
  ) {}

  /**
   * 인증된 유저에 대해서 토큰을 발급합니다.
   * @param userPayload user(seller)의 데이터
   * @param stayLogedIn 로그인 유지 여부
   * @param userType    로그인의 user 타입
   * @returns {token data} 토큰 관련 정보
   */
  issueToken(
    userPayload: UserPayload,
    stayLogedIn: boolean,
    userType: UserType,
  ): loginUserRes {
    // token에 들어갈 데이터를 입력한다. -> 유저 타입 정도는 들어가는 것이 좋을 듯하다.
    return {
      token_type: 'bearer',
      access_token: this.createAccessToken(userPayload),
      expires_in: ACCESS_TOKEN_EXPIRE_TIME_INT,
      refresh_token: this.createRefreshToken(userPayload, stayLogedIn),
      refresh_token_expires_in: stayLogedIn
        ? COOKIE_AUTO_LOGIN_EXPIRE_TIME
        : COOKIE_EXPIRE_TIME,
      scope: userType,
    };
  }

  /**
   * seller의 존재 여부를 확인한다. 다른 유저 타입에 대해서도 조회가 가능하도록 구현 필요
   * @param email 입력한 이메일 문자열
   * @param pwdInput 입력한 패스워드 문자열
   * @returns {SellerPayload} User 인터페이스 객체
   */
  async validateUser(
    type: UserType,
    email: string,
    pwdInput: string,
  ): Promise<UserPayload | null> {
    let user: Seller | Broadcaster;
    if (['admin', 'seller'].includes(type)) {
      user = await this.sellerService.login(email, pwdInput);
    }
    if (['broadcaster'].includes(type)) {
      user = await this.broadcasterService.login(email, pwdInput);
    }
    return this.castUser(user, type);
  }

  /**
   * 로그인시, 응답 객체에 새로운 Access Token을 헤더에 추가합니다.
   * @param res 요청 객체
   * @param userPayload Token에 저장될 payload
   */
  handleLoginHeader(res: Response, loginToken: loginUserRes): void {
    res.append('Cache-Control', 'no-cache');
    res.append('X-wt-Access-Token', loginToken.access_token);
    res.cookie('refresh_token', loginToken.refresh_token, {
      httpOnly: true,
      maxAge: loginToken.refresh_token_expires_in,
    });
  }

  /**
   * 로그아웃시, 응답 객체의 쿠키 삭제, logout을 위한 토큰 전달
   * @param res 요청 객체
   */
  handleLogoutHeader(res: Response): void {
    res.cookie('refresh_token', '', {
      httpOnly: true,
      maxAge: 0,
    });
    res.set('X-wt-Access-Token', 'logout');
  }

  /**
   * Access Token의 만료시, 응답 객체에 새로운 Access Token을 헤더에 추가합니다.
   * @param res 요청 객체
   * @param userPayload Token에 저장될 payload
   */
  handleAuthorizationHeader(res: Response, userPayload: UserPayload): void {
    const newAccessToken = this.createAccessTokenByRefresh(userPayload);
    res.append('X-wt-Access-Token', `${newAccessToken}`);
  }

  /**
   * 요청 객체의 쿠키에서 refresh token을 가져와 검증 후, payload를 전달합니다.
   * @param req 요청 객체
   * @param userPayload Token에 저장될 payload
   */
  validateRefreshToken(req: Request): UserPayload {
    const cookieRefreshToken: string | undefined = req.cookies?.refresh_token;
    try {
      // 암호화 미사용시 제거
      const refreshToken = this.cipherService.getRefreshToken(cookieRefreshToken);
      const tokenUserPayload = this.jwtService.verify(refreshToken);
      const userPayload = this.castUserPayload(tokenUserPayload);
      return userPayload;
    } catch (err) {
      return null;
    }
  }

  castUser(user: Seller | Broadcaster, type: UserType): UserPayload {
    return {
      sub: user.email,
      type,
    };
  }

  private castUserPayload(userPayload: UserPayload): UserPayload {
    return {
      sub: userPayload.sub,
      type: userPayload.type,
    };
  }

  private createRefreshToken(userPayload: UserPayload, stayLogedIn: boolean): string {
    const refreshToken: string = this.jwtService.sign(userPayload, {
      expiresIn: stayLogedIn ? AUTO_LOGIN_EXPIRE_TIME : REFRESH_TOKEN_EXPIRE_TIME,
    });
    // 암호화 미사용시 제거
    const cookieRefreshToken = this.cipherService.createCookieRefreshToken(refreshToken);
    return cookieRefreshToken;
  }

  private createAccessToken(userPayload: UserPayload): string {
    return this.jwtService.sign(userPayload, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    });
  }

  private createAccessTokenByRefresh(tokenUserPayload: UserPayload): string {
    const userPayload = this.castUserPayload(tokenUserPayload);
    const newAccessToken = this.createAccessToken(userPayload);
    return `${newAccessToken}`;
  }

  async getProfile(userPayload: UserPayload, appType: UserType): Promise<UserProfileRes> {
    const { sub, type } = userPayload;
    let user: Seller | Broadcaster;
    if (['admin', 'seller'].includes(type)) {
      if (appType !== 'seller') {
        throw new UnauthorizedException();
      }
      user = await this.sellerService.findOne({ email: sub });
    }
    if (['broadcaster'].includes(type)) {
      if (appType !== 'broadcaster') {
        throw new UnauthorizedException();
      }
      user = await this.broadcasterService.findOne({ email: sub });
    }
    const hasPassword = Boolean(user.password);
    const { password, ..._user } = user;

    return {
      ..._user,
      type,
      hasPassword,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { verify } from 'argon2';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginToken, User, UserPayload } from './auth.interface';
import { SellerService } from '../seller/seller.service';
import { CipherService } from './cipher.service';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
  AUO_LOGIN_EXPIRE_TIME,
  COOKIE_AUO_LOGIN_EXPIRE_TIME,
  COOKIE_EXPIRE_TIME,
  ACCESS_TOKEN_EXPIRE_TIME_INT,
} from './auth.constant';

@Injectable()
export class AuthService {
  // private를 사용하는 이유는 해당 Service를 내부에서만 사용할 것이기 떄문이다.
  constructor(
    private sellerService: SellerService,
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
    userType: string,
  ): LoginToken {
    // token에 들어갈 데이터를 입력한다. -> 유저 타입 정도는 들어가는 것이 좋을 듯하다.
    return {
      token_type: 'bearer',
      access_token: this.createAccessToken(userPayload),
      expires_in: ACCESS_TOKEN_EXPIRE_TIME_INT,
      refresh_token: this.createRefreshToken(userPayload, stayLogedIn),
      refresh_token_expires_in: stayLogedIn
        ? COOKIE_AUO_LOGIN_EXPIRE_TIME
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
  async validateUser(email: string, pwdInput: string): Promise<UserPayload> {
    const user = await this.sellerService.findOne({ email });
    if (!user) {
      return null;
    }
    const isCorrect = await this.validatePassword(pwdInput, user.password);
    if (!isCorrect) {
      return null;
    }
    return this.castUser(user);
  }

  /**
   * 입력한 비밀번호를 해시된 비밀번호와 비교합니다.
   * @param pwInput 입력한 비밀번호 문자열
   * @param hashedPw 해시된 비밀번호 값
   * @returns {boolean} 올바른 비밀번호인지 여부
   */
  async validatePassword(pwInput: string, hashedPw: string): Promise<boolean> {
    const isCorrect = await verify(hashedPw, pwInput);
    return isCorrect;
  }

  /**
   * 요청 객체에 새로운 Access Token을 헤더에 추가합니다.
   * @param req 요청 객체
   * @param userPayload Token에 저장될 payload
   */
  handleAuthorizationHeader(req: Request, userPayload: UserPayload): void {
    const newAccessToken = this.createAccessTokenByRefresh(userPayload);
    req.headers.authorization = newAccessToken;
  }

  /**
   * 요청 객체의 쿠키에서 refresh token을 가져와 검증 후, payload를 전달합니다.
   * @param req 요청 객체
   * @param userPayload Token에 저장될 payload
   */
  validateRefreshToken(req: Request) {
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

  private castUser(user: User): UserPayload {
    return {
      sub: user.email,
    };
  }

  private castUserPayload(userPayload: UserPayload): UserPayload {
    return {
      sub: userPayload.sub,
    };
  }

  private createRefreshToken(userPayload: UserPayload, stayLogedIn: boolean): string {
    const refreshToken: string = this.jwtService.sign(userPayload, {
      expiresIn: stayLogedIn ? AUO_LOGIN_EXPIRE_TIME : REFRESH_TOKEN_EXPIRE_TIME,
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
    return `Bearer ${newAccessToken}`;
  }
}

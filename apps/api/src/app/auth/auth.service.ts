import { Injectable } from '@nestjs/common';
import argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SellerPayload } from '../login.interface';
import { SellerService } from '../seller/seller.service';

@Injectable()
export class AuthService {
  // private를 사용하는 이유는 해당 Service를 내부에서만 사용할 것이기 떄문이다.
  constructor(private sellerService: SellerService, private jwtService: JwtService) {}

  /**
   * seller의 존재 여부를 확인한다. 다른 유저 타입에 대해서도 조회가 가능하도록 구현 필요
   * @param email 입력한 이메일 문자열
   * @returns {UserPayload} User 인터페이스 객체
   */
  async validateUser(email: string, pwdInput: string): Promise<SellerPayload> {
    const user = await this.sellerService.findOne({ email });
    if (!user) {
      return null;
    }

    const isCorrect = await this.validatePassword(pwdInput, user.password);
    if (!isCorrect) {
      return null;
    }

    const { password, ...result } = user;

    return result;
  }

  /**
   * 입력한 비밀번호를 해시된 비밀번호와 비교합니다.
   * @param pwInput 입력한 비밀번호 문자열
   * @param hashedPw 해시된 비밀번호 값
   * @returns {boolean} 올바른 비밀번호인지 여부
   */
  async validatePassword(pwInput: string, hashedPw: string): Promise<boolean> {
    const isCorrect = await argon.verify(hashedPw, pwInput);
    return isCorrect;
  }

  /**
   * 인증된 유저에 대해서 로그인을 실시합니다.
   * @param user localStrategy를 통해 반환되는 user(seller)의 데이터
   * @returns {access_token} 인증된 jwt
   * @returns {refresh_token} jwt를 연장하기 위한 토큰
   */
  async login(user: any, stayLogedIn: boolean) {
    const userPayload = { sub: user.email, name: user.name };
    return {
      accessToken: this.createAccessToken(userPayload),
      refreshToken: this.createRefreshToken(userPayload, stayLogedIn),
    };
  }

  private createAccessToken(userPayload: any): string {
    return this.jwtService.sign(userPayload, {
      expiresIn: '15m',
    });
  }

  private createRefreshToken(userPayload: any, stayLogedIn: boolean): string {
    // refresh token은 자동로그인 동의시 14일, 자동로그인 미동의시 30분의 유효기간을 가진다.
    return this.jwtService.sign(userPayload, {
      expiresIn: stayLogedIn ? '14d' : '30m',
    });
  }

  private createAccessTokenByRefresh(userPayload: any): string {
    const newAccessToken = this.createAccessToken({
      sub: userPayload.sub,
      name: userPayload.name,
    });
    return `Bearer ${newAccessToken}`;
  }

  handleAuthorizationHeader(req: Request, userPayload: any): void {
    // 새로운 access token 발급.
    const newAccessToken = this.createAccessTokenByRefresh(userPayload);
    // 새로운 access token 적용
    req.headers.authorization = newAccessToken;
  }

  validateRefreshToken(req: Request) {
    const refreshToken: string | undefined = req.cookies?.refresh_token;
    try {
      const userPayload = this.jwtService.verify(refreshToken);
      return userPayload;
    } catch (err) {
      // refresh token is expired
      return null;
    }
  }
}

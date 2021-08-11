import { Injectable } from '@nestjs/common';
import argon from 'argon2';
import { Seller } from '@prisma/client';
// import { UserPayload } from '../login.interface';
import { SellerService } from '../seller/seller.service';

@Injectable()
export class AuthService {
  // private를 사용하는 이유는 해당 Service를 내부에서만 사용할 것이기 떄문이다.
  constructor(private sellerService: SellerService) {}

  /**
   * seller의 존재 여부를 확인한다. 다른 유저 타입에 대해서도 조회가 가능하도록 구현 필요
   * @param email 입력한 이메일 문자열
   * @returns {UserPayload} User 인터페이스 객체
   */
  async validateUser(email: string, password: string): Promise<Seller> {
    const user = await this.sellerService.findOne({ email });
    if (!user) {
      return null;
    }

    const isCorrect = await this.validatePassword(password, user.password);
    if (!isCorrect) {
      return null;
    }

    return user;
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
}

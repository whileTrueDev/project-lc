import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Seller } from '@prisma/client';
import argon from 'argon2';

@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 회원 가입
   */
  async signUp(signUpInput: Prisma.SellerCreateInput): Promise<Seller> {
    const hashedPw = await this.hashPassword(signUpInput.password);
    return this.prisma.seller.create({
      data: {
        ...signUpInput,
        password: hashedPw,
      },
    });
  }

  /**
   * 유저 정보 조회
   */
  async findOne(findInput: Prisma.SellerWhereUniqueInput) {
    const seller = await this.prisma.seller.findUnique({
      where: findInput,
    });

    return seller;
  }

  /**
   * 비밀번호를 단방향 암호화 합니다.
   * @param purePw 비밀번호 문자열
   * @returns {string} 비밀번호 해시값
   */
  private async hashPassword(purePw: string): Promise<string> {
    const hashed = await argon.hash(purePw);
    return hashed;
  }

  /**
   * 입력한 비밀번호를 해시된 비밀번호와 비교합니다.
   * @param pwInput 입력한 비밀번호 문자열
   * @param hashedPw 해시된 비밀번호 값
   * @returns {boolean} 올바른 비밀번호인지 여부
   */
  private async verifyPassword(pwInput: string, hashedPw: string): Promise<boolean> {
    const isCorrect = await argon.verify(hashedPw, pwInput);
    return isCorrect;
  }
}

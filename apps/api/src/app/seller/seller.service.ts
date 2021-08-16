import { Injectable } from '@nestjs/common';
import { Prisma, Seller } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}

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
    const hashed = await hash(purePw);
    return hashed;
  }
}

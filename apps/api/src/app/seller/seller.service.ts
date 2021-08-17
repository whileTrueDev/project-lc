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
    const seller = await this.prisma.seller.create({
      data: {
        email: signUpInput.email,
        name: signUpInput.name,
        password: hashedPw,
      },
    });
    return seller;
  }

  /**
   * 유저 정보 조회
   */
  async findOne(
    findInput: Prisma.SellerWhereUniqueInput,
  ): Promise<Omit<Seller, 'password'>> {
    const seller = await this.prisma.seller.findUnique({
      where: findInput,
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
      },
    });

    return seller;
  }

  /** 비밀번호를 포함한 유저정보 조회 */
  async findOneWithPassword(findInput: Prisma.SellerWhereUniqueInput): Promise<Seller> {
    const seller = await this.prisma.seller.findUnique({
      where: findInput,
    });

    return seller;
  }

  /**
   * 이메일 주소가 중복되는 지 체크합니다.
   * @param email 중복체크할 이메일 주소
   * @returns {boolean} 중복되지않아 괜찮은 경우 true, 중복된 경우 false
   */
  async isEmailDupCheckOk(email: string): Promise<boolean> {
    const user = await this.prisma.seller.findFirst({ where: { email } });
    if (user) return false;
    return true;
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

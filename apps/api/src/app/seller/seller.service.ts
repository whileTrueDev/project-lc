import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Seller } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 회원 가입
   */
  signUp(signUpInput: Prisma.SellerCreateInput): Promise<Seller> {
    return this.prisma.seller.create({
      data: signUpInput,
    });
  }

  /**
   * 유저 정보 조회
   */
  findOne(findInput: Prisma.SellerFindUniqueArgs) {
    return this.prisma.seller.findUnique(findInput);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

type GoogleProfile = {
  id: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
};
@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  public async findSellerWithEmail(email: string) {
    const row = await this.prisma.seller.findUnique({
      where: { email },
      include: { socialAccounts: true },
    });
    return row;
  }

  async registSeller(sellerCreateInput: Prisma.SellerCreateInput) {
    const newSeller = await this.prisma.seller.create({
      data: sellerCreateInput,
      include: { socialAccounts: true },
    });
    return newSeller;
  }

  async login(loginDto) {
    console.log('토큰발급 & 저장하는 로그인 처리', { loginDto });
    return {
      result: '로그인 했음',
      accessToken: '가짜토큰',
      loginUser: loginDto,
    };
  }

  /** 구글 로그인 */
  async googleLogin(req) {
    if (!req.user) {
      // 해당 구글 계정이 없음(에러)
      throw new BadRequestException('해당 구글 계정이 존재하지 않습니다');
    }

    const reqUser: GoogleProfile = req.user;

    // 동일 email로 가입된 계정이 있는지 확인
    const existSeller = await this.findSellerWithEmail(reqUser.email);

    // 해당 email로 가입된 계정이 존재하지않으면 구글계정으로 가입(회원가입)
    if (!existSeller) {
      const seller = {
        email: reqUser.email,
        name: reqUser.name,
        password: null,
        socialAccounts: {
          create: {
            serviceId: reqUser.id,
            service: 'google',
            name: reqUser.name,
            profileImage: reqUser.picture,
          },
        },
      };
      await this.registSeller(seller); // 회원강
    }

    // 해당 email로 가입된 계정 존재하나 구글계정 등록 안되어있는 경우 구글계정 추가
    const services = existSeller.socialAccounts.map((account) => account.service);
    if (!services.includes('google')) {
      // 구글계정 레코드 생성 & seller에 등록
      await this.prisma.seller.update({
        where: {
          email: existSeller.email,
        },
        data: {
          socialAccounts: {
            create: {
              serviceId: reqUser.id,
              service: 'google',
              name: reqUser.name,
              profileImage: reqUser.picture,
            },
          },
        },
      });
    }

    // 로그인처리
    const seller = await this.prisma.seller.findUnique({
      where: { email: reqUser.email },
      select: {
        id: true,
        email: true,
        name: true,
        socialAccounts: true,
      },
    });
    return this.login(seller);
  }
}

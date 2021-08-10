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

  async findSocialAccountWithServiceId(serviceId: string, provider: string) {
    const row = await this.prisma.socialAccount.findFirst({
      where: {
        serviceId,
        provider,
      },
      include: { seller: true },
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

  async googleLoginTest(req) {
    if (!req.user) {
      // 해당 구글 계정이 없음(에러)
      throw new BadRequestException('해당 구글 계정이 존재하지 않습니다');
    }

    const reqUser: GoogleProfile = req.user;
    return reqUser;
  }

  /** 구글 로그인 */
  async googleLogin(req) {
    if (!req.user) {
      // 해당 구글 계정이 없음(에러)
      throw new BadRequestException('해당 구글 계정이 존재하지 않습니다');
    }

    const reqUser: GoogleProfile = req.user;

    // 구글 아이디로 가입된 Seller(user)있는지 확인
    const existSocialAccount = await this.findSocialAccountWithServiceId(
      reqUser.id,
      'google',
    );

    // 해당 이메일로 가입된 유저 확인
    const existSeller = await this.findSellerWithEmail(reqUser.email);

    // 해당 email로 가입된 계정이 존재하지않으면 구글계정으로 가입(회원가입)
    if (!existSeller) {
      const seller = {
        email: reqUser.email,
        name: reqUser.name,
        password: '',
        socialAccounts: {
          create: {
            serviceId: reqUser.id,
            provider: 'google',
            name: reqUser.name,
            profileImage: reqUser.picture,
          },
        },
      };
      await this.registSeller(seller); // 회원가입 후 로그인 처리
      // 로그인처리
      const newSeller = await this.prisma.seller.findUnique({
        where: { email: reqUser.email },
        select: {
          id: true,
          email: true,
          name: true,
          socialAccounts: true,
        },
      });
      return this.login(newSeller);
    }

    // 구글계정 등록 안되어있는 경우 구글계정 추가
    if (!existSocialAccount) {
      await this.prisma.seller.update({
        where: {
          email: existSeller.email,
        },
        data: {
          socialAccounts: {
            create: {
              serviceId: reqUser.id,
              provider: 'google',
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

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: id/pw 로그인과 동일한 로직일경우 수정하기
  async login(user) {
    console.log('토큰발급 & 저장하는 로그인 처리 - 유저정보 : ', { user });
    // TODO: 토큰 발급
    // TODO: 토큰 저장
    return {
      accessToken: '가짜토큰',
      refreshToken: '가짜 리프레시 토큰',
    };
  }

  /**
   * 해당 구글 계정 소유하는 seller 찾거나 생성하여 반환
   * googleStrategy validate함수에서 사용
   * @param param0
   * @returns
   */
  async findOrCreateSeller({
    id,
    provider,
    email,
    name,
    picture,
    accessToken,
    refreshToken,
  }: {
    id: string;
    provider: string;
    email: string;
    name: string;
    picture: string;
    accessToken: string;
    refreshToken?: string;
  }) {
    // google 계정으로 가입된 셀러
    const socialAccount = await this.prisma.sellerSocialAccount.findFirst({
      where: { serviceId: id, provider },
      include: { seller: true },
    });

    if (!socialAccount) {
      // 해당 구글계정 없는경우
      // email로 셀러찾기 혹은 만들기
      const googleAccountCreateInput = {
        serviceId: id,
        provider: 'google',
        name,
        profileImage: picture,
        accessToken,
        refreshToken,
      };
      await this.prisma.seller.upsert({
        where: { email },
        update: {
          socialAccounts: {
            create: googleAccountCreateInput,
          },
        },
        create: {
          email,
          name,
          password: '',
          socialAccounts: {
            create: googleAccountCreateInput,
          },
        },
      });
    }

    // 구글 계정 가진 셀러 반환
    return this.prisma.seller.findUnique({
      where: { email },
      select: { name: true, email: true, socialAccounts: true },
    });
  }
}

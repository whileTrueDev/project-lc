import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

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

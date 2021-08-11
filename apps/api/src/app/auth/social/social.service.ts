import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Seller, SellerSocialAccount } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import axios from 'axios';

export type SellerWithSocialAccounts = Omit<Seller, 'password'> & {
  socialAccounts: SellerSocialAccount[];
};

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 셀러 계정정보 찾기
   */
  async findSocialAccountIncludeSeller({
    provider,
    serviceId,
  }: {
    provider: string;
    serviceId: string;
  }) {
    return this.prisma.sellerSocialAccount.findFirst({
      where: { serviceId, provider },
      include: { seller: true },
    });
  }

  /** 셀러의 id나 email로 셀러의 소셜계정 포함한 정보 조회하기 */
  async findSellerIncludeSocialAccount({ id, email }: { id?: number; email?: string }) {
    if (!id && !email) {
      throw Error('id나 email 중 하나를 입력해야 합니다');
    }
    const select = { id: true, email: true, name: true, socialAccounts: true };
    if (id) {
      return this.prisma.seller.findUnique({
        where: { id },
        select,
      });
    }
    return this.prisma.seller.findUnique({
      where: { email },
      select,
    });
  }

  /**
   * 해당 소셜서비스 계정 소유하는 seller 찾거나 생성하여 반환
   * googleStrategy validate함수에서 사용
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
  }): Promise<SellerWithSocialAccounts> {
    const socialAccountWithSeller = await this.findSocialAccountIncludeSeller({
      provider,
      serviceId: id,
    });

    if (!socialAccountWithSeller) {
      // 해당 social service 계정 없는경우
      // email로 셀러찾기 혹은 만들기
      const googleAccountCreateInput = {
        serviceId: id,
        provider,
        name,
        profileImage: picture,
        accessToken,
        refreshToken,
      };
      const createdSeller = await this.prisma.seller.upsert({
        where: { email },
        update: {
          socialAccounts: {
            create: googleAccountCreateInput,
          },
        },
        create: {
          email,
          name,
          password: null,
          socialAccounts: {
            create: googleAccountCreateInput,
          },
        },
      });
      return this.findSellerIncludeSocialAccount({ id: createdSeller.id });
    }
    return this.findSellerIncludeSocialAccount({
      id: socialAccountWithSeller.seller.id,
    });
  }

  /** 카카오 계정 연동해제 & 카카오 소셜계정 레코드 삭제 */
  async kakaoUnlink(kakaoId) {
    const socialAccount = await this.findSocialAccountIncludeSeller({
      provider: 'kakao',
      serviceId: kakaoId,
    });
    if (!socialAccount) {
      throw new BadRequestException(
        `해당 kakaoId로 연동된 계정이 존재하지 않음 kakaoId: ${kakaoId}`,
      );
    }

    const kakaoAccessToken = socialAccount.accessToken;
    // 카카오 계정연동 해제 요청
    try {
      const result = await axios.post(
        'https://kapi.kakao.com/v1/user/unlink',
        undefined,
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
          },
        },
      );

      if (result.status === 200) {
        // socialAccount에서 삭제
        await this.prisma.sellerSocialAccount.delete({
          where: { serviceId: kakaoId },
        });
        return true; // 연동된 SellerId(number) 반환
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}

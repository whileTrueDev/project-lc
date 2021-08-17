import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Seller, SellerSocialAccount } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import axios from 'axios';
import { SellerService } from '../seller/seller.service';

export type SellerWithSocialAccounts = Omit<Seller, 'password'> & {
  socialAccounts: Omit<SellerSocialAccount, 'accessToken' | 'refreshToken'>[];
};

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly sellerService: SellerService,
  ) {}

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
  }) {
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
      return this.sellerService.findOne({ id: createdSeller.id });
    }

    // 토큰정보 업데2트
    await this.prisma.sellerSocialAccount.update({
      where: { serviceId: id },
      data: {
        accessToken,
        refreshToken,
        profileImage: picture,
      },
    });
    return this.sellerService.findOne({ id: socialAccountWithSeller.seller.id });
  }

  /** 소셜계정 데이터 삭제 */
  async deleteSocialAccountRecord(serviceId: string): Promise<boolean> {
    await this.prisma.sellerSocialAccount.delete({
      where: { serviceId },
    });
    return true;
  }

  /** 소셜계정 테이블에서 accessToken 가져오기 */
  async getSocialAccountAccessToken(provider: string, serviceId: string) {
    const socialAccount = await this.findSocialAccountIncludeSeller({
      provider,
      serviceId,
    });
    if (!socialAccount) {
      throw new BadRequestException(
        `해당 서비스로 연동된 계정이 존재하지 않음 provider: ${provider}, serviceId: ${serviceId}`,
      );
    }
    return socialAccount.accessToken;
  }

  /** 카카오 계정 연동해제 & 카카오 소셜계정 레코드 삭제 */
  async kakaoUnlink(kakaoId) {
    const kakaoAccessToken = await this.getSocialAccountAccessToken('kakao', kakaoId);
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
        return this.deleteSocialAccountRecord(kakaoId);
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 네이버 계정연동 해제 && 네이버 계정 레코드 삭제 */
  async naverUnlink(naverId: string) {
    const naverAccessToken = await this.getSocialAccountAccessToken('naver', naverId);
    // 네이버 계정연동 해제 요청
    try {
      const result = await axios.get('https://nid.naver.com/oauth2.0/token', {
        params: {
          client_id: this.configService.get('NAVER_CLIENT_ID'),
          client_secret: this.configService.get('NAVER_CLIENT_SECRET'),
          access_token: encodeURI(naverAccessToken),
          grant_type: 'delete',
          service_provider: 'naver',
        },
      });

      if (result.status === 200) {
        return this.deleteSocialAccountRecord(naverId);
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 구글 계정 연동 해제 && 구글 계정 레코드 삭제 */
  async googleUnlink(googleId: string) {
    const googleAccessToken = await this.getSocialAccountAccessToken('google', googleId);
    // 구글 계정연동 해제 요청
    try {
      const result = await axios.post('https://oauth2.googleapis.com/revoke', undefined, {
        params: {
          token: encodeURI(googleAccessToken),
        },
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      });

      if (result.status === 200) {
        return this.deleteSocialAccountRecord(googleId);
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}

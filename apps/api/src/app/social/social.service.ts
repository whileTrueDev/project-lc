import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Seller, SellerSocialAccount } from '@prisma/client';
import { loginUserRes } from '@project-lc/shared-types';
import { PrismaService } from '@project-lc/prisma-orm';
import axios from 'axios';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { SellerService } from '../seller/seller.service';

export type SellerWithSocialAccounts = Omit<Seller, 'password'> & {
  socialAccounts: Omit<SellerSocialAccount, 'accessToken' | 'refreshToken'>[];
};

interface sellerDataInterface {
  id: string;
  provider: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly sellerService: SellerService,
    private readonly authService: AuthService,
  ) {}

  async login(req: Request, res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user }: any = req;
    const userPayload = this.authService.castUser(user);
    const loginToken: loginUserRes = this.authService.issueToken(
      userPayload,
      true,
      'seller',
    );
    this.authService.handleLoginHeader(res, loginToken);
  }

  /**
   * 해당 소셜서비스 계정 소유하는 seller 찾거나 생성하여 반환
   * google, kakao, naver strategy validate함수에서 사용
   */
  async findOrCreateSeller(sellerData: sellerDataInterface) {
    const socialAccountWithSeller = await this.selectSocialAccountRecord(sellerData);

    if (!socialAccountWithSeller) {
      const createdSeller = await this.createSocialAccountRecord(sellerData);
      return createdSeller;
    }

    await this.updateSocialAccountRecord(sellerData);
    return this.sellerService.findOne({ id: socialAccountWithSeller.seller.id });
  }

  /** 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 셀러 계정정보 찾기 */
  private async selectSocialAccountRecord(sellerData: Partial<sellerDataInterface>) {
    const { id, provider } = sellerData;
    return this.prisma.sellerSocialAccount.findFirst({
      where: { serviceId: id, provider },
      include: { seller: true },
    });
  }

  /** 소셜계정 데이터 생성 */
  private async createSocialAccountRecord(
    sellerData: sellerDataInterface,
  ): Promise<Seller> {
    const { id, email, name, picture, ...rest } = sellerData;
    const googleAccountCreateInput = {
      serviceId: id,
      profileImage: picture,
      name,
      ...rest,
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

    return createdSeller;
  }

  /** 소셜계정 데이터 업데이트(토큰) */
  private async updateSocialAccountRecord(sellerData: sellerDataInterface) {
    const { id, accessToken, refreshToken, picture } = sellerData;
    const updatedSeller = await this.prisma.sellerSocialAccount.update({
      where: { serviceId: id },
      data: {
        accessToken,
        refreshToken,
        profileImage: picture,
      },
    });
    return updatedSeller;
  }

  /** 소셜계정 데이터 삭제 */
  private async deleteSocialAccountRecord(serviceId: string): Promise<boolean> {
    await this.prisma.sellerSocialAccount.delete({
      where: { serviceId },
    });
    return true;
  }

  /** 소셜계정 테이블에서 accessToken 가져오기 */
  private async getSocialAccountAccessToken(provider: string, serviceId: string) {
    const socialAccount = await this.selectSocialAccountRecord({
      provider,
      id: serviceId,
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

  async getSocialAccounts(email: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { email },
      select: {
        socialAccounts: {
          select: {
            serviceId: true,
            provider: true,
            name: true,
            registDate: true,
            profileImage: false,
            accessToken: false,
            refreshToken: false,
            sellerId: false,
          },
        },
      },
    });

    return seller.socialAccounts;
  }
}

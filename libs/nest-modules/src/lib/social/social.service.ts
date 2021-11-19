import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Seller, SellerSocialAccount } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { loginUserRes } from '@project-lc/shared-types';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { SellerService } from '../seller/seller.service';
import { GoogleApiService } from './platform-api/google-api.service';
import { KakaoApiService } from './platform-api/kakao-api.service';
import { NaverApiService } from './platform-api/naver-api.service';

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
    private readonly kakao: KakaoApiService,
    private readonly naver: NaverApiService,
    private readonly google: GoogleApiService,
  ) {}

  login(req: Request, res: Response): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user }: any = req;
    const userPayload = this.authService.castUser(user, 'seller');
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
  async findOrCreateSeller(sellerData: sellerDataInterface): Promise<Seller> {
    const socialAccountWithSeller = await this.selectSocialAccountRecord(sellerData);

    if (!socialAccountWithSeller) {
      const createdSeller = await this.createSocialAccountRecord(sellerData);
      return createdSeller;
    }

    await this.updateSocialAccountRecord(sellerData);
    return this.sellerService.findOne({ id: socialAccountWithSeller.seller.id });
  }

  /** 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 셀러 계정정보 찾기 */
  private async selectSocialAccountRecord(
    sellerData: Partial<sellerDataInterface>,
  ): Promise<
    SellerSocialAccount & {
      seller: Seller;
    }
  > {
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
        avatar: picture || null,
        password: null,
        socialAccounts: {
          create: googleAccountCreateInput,
        },
      },
    });

    return createdSeller;
  }

  /** 소셜계정 데이터 업데이트(토큰) */
  private async updateSocialAccountRecord(
    sellerData: sellerDataInterface,
  ): Promise<SellerSocialAccount> {
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

  /**
   * 소셜계정 데이터 삭제
   * @by 21.09.02 hwasurr -> 소셜로그인ExceptionFilter에서는 소셜계정이 DB에 없으므로,
   * unlink와 구분되어야하여, public 메서드로 변경 -> 컨드롤러단에서 두가지 일을 진행하도록 변경
   * */
  public async deleteSocialAccountRecord(serviceId: string): Promise<boolean> {
    await this.prisma.sellerSocialAccount.delete({
      where: { serviceId },
    });
    return true;
  }

  /** 소셜계정 테이블에서 accessToken 가져오기 */
  private async getSocialAccountAccessToken(
    provider: string,
    serviceId: string,
  ): Promise<string> {
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

  /**
   * 카카오 계정 연동해제 & 카카오 소셜계정 레코드 삭제
   * @param accessTokenParam 액세스토큰. 인수로 제공되지 않는 경우, DB에서 가져와 사용한다. @by hwasurr
   * */
  async kakaoUnlink(kakaoId: string, accessTokenParam?: string): Promise<boolean> {
    let kakaoAccessToken: string;
    if (!accessTokenParam) {
      kakaoAccessToken = await this.getSocialAccountAccessToken('kakao', kakaoId);
    } else {
      kakaoAccessToken = accessTokenParam;
    }
    // 카카오 계정연동 해제 요청
    try {
      await this.kakao.unlink(kakaoAccessToken);
      return true;
    } catch (error) {
      console.error(error);
      if (
        error?.response &&
        (error?.response?.status === 401 || error?.response?.data?.code === -401)
      ) {
        // 액세스 토큰 만료로 인한 실패의 경우, 액세스 토큰 리프레시 이후 연동 해제 진행
        const socialAccount = await this.selectSocialAccountRecord({
          provider: 'kakao',
          id: kakaoId,
        });
        // 액세스 토큰 리프레시
        const refreshRes = await this.kakao.refreshAccessToken(
          socialAccount.refreshToken,
        );
        await this.kakao.unlink(refreshRes.access_token);
        return true;
      }
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 네이버 계정연동 해제 && 네이버 계정 레코드 삭제
   * @param accessTokenParam 액세스토큰. 인수로 제공되지 않는 경우, DB에서 가져와 사용한다. @by hwasurr
   * */
  async naverUnlink(naverId: string, accessTokenParam?: string): Promise<boolean> {
    let naverAccessToken: string;
    if (!accessTokenParam) {
      naverAccessToken = await this.getSocialAccountAccessToken('naver', naverId);
    } else {
      naverAccessToken = accessTokenParam;
    }
    // 네이버 계정연동 해제 요청
    try {
      const isSuccess = await this.naver.unlink(naverAccessToken);
      if (!isSuccess) {
        // 액세스 토큰 만료로 인한 실패의 경우, 액세스 토큰 리프레시 이후 연동 해제 진행
        const socialAccount = await this.selectSocialAccountRecord({
          provider: 'naver',
          id: naverId,
        });
        const refreshRes = await this.naver.refreshAccessToken(
          socialAccount.refreshToken,
        );
        return this.naver.unlink(refreshRes.access_token);
      }
      return isSuccess;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * * 구글 계정 연동 해제 && 구글 계정 레코드 삭제
   * @param accessTokenParam 액세스토큰. 인수로 제공되지 않는 경우, DB에서 가져와 사용한다. @by hwasurr
   */
  async googleUnlink(googleId: string, accessTokenParam?: string): Promise<boolean> {
    let googleAccessToken: string;
    if (!accessTokenParam) {
      googleAccessToken = await this.getSocialAccountAccessToken('google', googleId);
    } else {
      googleAccessToken = accessTokenParam;
    }
    // 구글 계정연동 해제 요청
    try {
      await this.google.unlink(googleAccessToken);
      return true;
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.error === 'invalid_token'
      ) {
        // 액세스 토큰 만료로 인한 실패의 경우, 액세스 토큰 리프레시 이후 연동 해제 진행
        const socialAccount = await this.selectSocialAccountRecord({
          provider: 'google',
          id: googleId,
        });
        // 액세스 토큰 리프레시
        const refreshRes = await this.google.refreshAccessToken(
          socialAccount.refreshToken,
        );
        await this.google.unlink(refreshRes.access_token);
        return true;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getSocialAccounts(
    email: string,
  ): Promise<
    Pick<SellerSocialAccount, 'serviceId' | 'provider' | 'name' | 'registDate'>[]
  > {
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

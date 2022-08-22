import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Broadcaster,
  BroadcasterSocialAccount,
  Customer,
  CustomerSocialAccount,
  InactiveBroadcaster,
  InactiveBroadcasterSocialAccount,
  InactiveSeller,
  InactiveSellerSocialAccount,
  Seller,
  SellerSocialAccount,
} from '@prisma/client';
import { UserPayload } from '@project-lc/nest-core';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { CustomerService } from '@project-lc/nest-modules-customer';
import { SellerService } from '@project-lc/nest-modules-seller';
import { PrismaService } from '@project-lc/prisma-orm';
import { loginUserRes, SocialAccounts, UserType } from '@project-lc/shared-types';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { GoogleApiService } from './platform-api/google-api.service';
import { KakaoApiService } from './platform-api/kakao-api.service';
import { NaverApiService } from './platform-api/naver-api.service';

export type SellerWithSocialAccounts = Omit<Seller, 'password'> & {
  socialAccounts: Omit<SellerSocialAccount, 'accessToken' | 'refreshToken'>[];
};

interface UserDataInterface {
  id: string;
  provider: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly kakao: KakaoApiService,
    private readonly naver: NaverApiService,
    private readonly google: GoogleApiService,
    private readonly sellerService: SellerService,
    private readonly broadcasterService: BroadcasterService,
    private readonly customerService: CustomerService,
  ) {}

  login(userType: UserType, req: Request, res: Response): UserPayload {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user }: any = req;
    let userPayload: UserPayload;
    if (userType === 'broadcaster') {
      const { email, userName: name, id, password, avatar, inactiveFlag } = user;
      const broadcaster = {
        id,
        email,
        name,
        password,
        avatar,
        inactiveFlag,
      };
      userPayload = this.authService.createUserPayload(broadcaster as any, userType);
    } else {
      userPayload = this.authService.createUserPayload(user, userType);
    }

    if (userPayload.inactiveFlag) {
      return userPayload;
    }

    // local stragety에서 반환되는 req.user의 타입은 UserPayload이나
    // 소셜로그인 strategy에서 반환되는 req.user의 타입은 Broadcatser임
    // social.controller/login 에서 createLoginStamp 실행시 req.user는 userpayload로 cast되어있어야한다
    req.user = userPayload;

    const loginToken: loginUserRes = this.authService.issueToken(
      userPayload,
      true,
      userType,
    );
    this.authService.handleLogin(res, loginToken);
    return userPayload;
  }

  /** 유저타입에 따라 seller 나 broadcaster를 찾거나 생성하여 반환
   * google, kakao, naver strategy validate함수에서 사용
   */
  async findOrCreateUser(
    userType: UserType,
    data: UserDataInterface,
  ): Promise<Seller | Broadcaster | Customer | InactiveBroadcaster | InactiveSeller> {
    // 전달된 유저타입이 방송인인 경우 -> Broadcaster, BroadcasterSocialAccounts 테이블에서 작업
    if (userType === 'broadcaster') {
      const broadcaster = await this.findOrCreateBroadcaster(data);
      return broadcaster;
    }

    if (userType === 'customer') {
      const customer = await this.findOrCreateCustomer(data);
      return customer;
    }

    // 전달된 유저타입이 판매자인 경우 -> Seller, SellerSocialAccounts 테이블에서 작업
    const seller = await this.findOrCreateSeller(data);
    return seller;
  }

  // -------------------------
  // 방송인
  // -------------------------
  /** 해당 소셜서비스 계정 소유하는 broadcaster 찾거나 생성하여 반환 */
  async findOrCreateBroadcaster(userData: UserDataInterface): Promise<Broadcaster> {
    const socialAccountWithBroadcaster = await this.selectBroadcasterSocialAccountRecord(
      userData,
    );

    const inActiveSocialAccountWithBroadcaster =
      await this.selectInactiveBroadcasterSocialAccountRecord(userData);

    if (inActiveSocialAccountWithBroadcaster) {
      return this.broadcasterService.findInactiveOne({
        id: inActiveSocialAccountWithBroadcaster.broadcaster.id,
      });
    }

    if (!socialAccountWithBroadcaster) {
      const createdBroadcaster = await this.createBroadcasterSocialAccountRecord(
        userData,
      );
      return createdBroadcaster;
    }

    await this.updateSocialAccountRecord('broadcaster', userData);
    return this.broadcasterService.findOne({
      id: socialAccountWithBroadcaster.broadcaster.id,
    });
  }

  /** 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 방송인 계정정보 찾기 */
  private async selectBroadcasterSocialAccountRecord(
    userData: Partial<UserDataInterface>,
  ): Promise<BroadcasterSocialAccount & { broadcaster: Broadcaster }> {
    const { id, provider } = userData;
    return this.prisma.broadcasterSocialAccount.findFirst({
      where: { serviceId: id, provider },
      include: { broadcaster: true },
    });
  }

  /** 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 휴면 방송인 계정정보 찾기 */
  private async selectInactiveBroadcasterSocialAccountRecord(
    userData: Partial<UserDataInterface>,
  ): Promise<InactiveBroadcasterSocialAccount & { broadcaster: InactiveBroadcaster }> {
    const { id, provider } = userData;
    return this.prisma.inactiveBroadcasterSocialAccount.findFirst({
      where: { serviceId: id, provider },
      include: { broadcaster: true },
    });
  }

  /** 방송인 소셜계정 데이터 생성 */
  private async createBroadcasterSocialAccountRecord(
    userData: UserDataInterface,
  ): Promise<Broadcaster> {
    const { id, email, name, picture, ...rest } = userData;
    const socialAccountCreateInput = {
      serviceId: id,
      profileImage: picture,
      name,
      ...rest,
    };

    const createdBroadcaster = await this.prisma.broadcaster.upsert({
      where: { email },
      update: {
        socialAccounts: {
          create: socialAccountCreateInput,
        },
      },
      create: {
        email,
        userName: name,
        overlayUrl: `/${email}`,
        avatar: picture || null,
        password: null,
        socialAccounts: {
          create: socialAccountCreateInput,
        },
      },
    });

    return createdBroadcaster;
  }

  // -------------------------
  // 소비자
  // -------------------------

  /** 해당 소셜서비스 계정 소유하는 소비자 찾거나 생성하여 반환 */
  async findOrCreateCustomer(userData: UserDataInterface): Promise<Customer> {
    const saWithCustomer = await this.selectCustomerSocialAccountRecord(userData);

    // * 소비자 휴면 계정 로그인시
    // const saWithCustomerinActive =
    //   await this.selectInactiveCustomerSocialAccountRecord(userData);
    // if (saWithCustomerinActive) {
    //   return this.customerService.findInactiveOne({
    //     id: saWithCustomerinActive.broadcaster.id,
    //   });
    // }

    if (!saWithCustomer) {
      const createdCustomer = await this.createCustomerSocialAccountRecrod(userData);
      return createdCustomer;
    }

    await this.updateSocialAccountRecord('customer', userData);
    return this.customerService.findOne({ id: saWithCustomer.customer.id });
  }

  /** 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 소비자 계정정보 찾기 */
  private async selectCustomerSocialAccountRecord(
    userData: Partial<UserDataInterface>,
  ): Promise<CustomerSocialAccount & { customer: Customer }> {
    const { id, provider } = userData;
    return this.prisma.customerSocialAccount.findFirst({
      where: { serviceId: id, provider },
      include: { customer: true },
    });
  }

  /** 소비자 소셜계정 데이터 생성 */
  private async createCustomerSocialAccountRecrod(
    userData: UserDataInterface,
  ): Promise<Customer> {
    const { id, email, name, picture, ...rest } = userData;
    const socialAccountCreateInput = {
      serviceId: id,
      profileImage: picture,
      name,
      ...rest,
    };

    const createdCustomer = await this.prisma.customer.upsert({
      where: { email },
      update: { socialAccounts: { create: socialAccountCreateInput } },
      create: {
        email,
        name,
        password: null,
        socialAccounts: { create: socialAccountCreateInput },
      },
    });
    return createdCustomer;
  }

  // -------------------------
  // 판매자
  // -------------------------
  /** 해당 소셜서비스 계정 소유하는 판매자 찾거나 생성하여 반환 */
  async findOrCreateSeller(
    sellerData: UserDataInterface,
  ): Promise<Seller | InactiveSeller> {
    const socialAccountWithSeller = await this.selectSellerSocialAccountRecord(
      sellerData,
    );
    const inactiveSocialAccountWithSeller =
      await this.selectInactiveSellerSocialAccountRecord(sellerData);
    if (inactiveSocialAccountWithSeller) {
      // 복구코드
      return this.sellerService.findInactiveOne({
        id: inactiveSocialAccountWithSeller.seller.id,
      });
    }
    if (!socialAccountWithSeller) {
      const createdSeller = await this.createSellerSocialAccountRecord(sellerData);
      return createdSeller;
    }

    await this.updateSocialAccountRecord('seller', sellerData);
    return this.sellerService.findOne({ id: socialAccountWithSeller.seller.id });
  }

  /** 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 판매자 계정정보 찾기 */
  private async selectSellerSocialAccountRecord(
    sellerData: Partial<UserDataInterface>,
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

  /** 소셜서비스와 서비스고유아이디로 소셜계정이 등록된 판매자 휴면 계정정보 찾기 */
  private async selectInactiveSellerSocialAccountRecord(
    sellerData: Partial<UserDataInterface>,
  ): Promise<
    InactiveSellerSocialAccount & {
      seller: InactiveSeller;
    }
  > {
    const { id, provider } = sellerData;
    return this.prisma.inactiveSellerSocialAccount.findFirst({
      where: { serviceId: id, provider },
      include: { seller: true },
    });
  }

  /** 판매자 소셜계정 데이터 생성 */
  private async createSellerSocialAccountRecord(
    sellerData: UserDataInterface,
  ): Promise<Seller> {
    const { id, email, name, picture, ...rest } = sellerData;
    const socialAccountCreateInput = {
      serviceId: id,
      profileImage: picture,
      name,
      ...rest,
    };

    const createdSeller = await this.prisma.seller.upsert({
      where: { email },
      update: {
        socialAccounts: {
          create: socialAccountCreateInput,
        },
      },
      create: {
        email,
        name,
        avatar: picture || null,
        password: null,
        socialAccounts: {
          create: socialAccountCreateInput,
        },
      },
    });

    return createdSeller;
  }

  /**
   * 판매자 소셜계정 데이터 삭제
   * @by 21.09.02 hwasurr -> 소셜로그인ExceptionFilter에서는 소셜계정이 DB에 없으므로,
   * unlink와 구분되어야하여, public 메서드로 변경 -> 컨드롤러단에서 두가지 일을 진행하도록 변경
   * */
  public async deleteSocialAccountRecord(
    userType: UserType,
    serviceId: string,
  ): Promise<boolean> {
    if (userType === 'seller' || userType === 'admin') {
      await this.prisma.sellerSocialAccount.delete({ where: { serviceId } });
    }
    if (userType === 'broadcaster') {
      await this.prisma.broadcasterSocialAccount.delete({ where: { serviceId } });
    }
    if (userType === 'customer') {
      await this.prisma.customerSocialAccount.delete({ where: { serviceId } });
    }
    return true;
  }

  /** 소셜계정 데이터 업데이트(토큰)
   * @param userType 'seller' | 'broadcaster' | 'customer'
   * @userData 소셜플랫폼에서 넘어온 정보(토큰 정보 포함)
   */
  private async updateSocialAccountRecord(
    userType: UserType,
    userData: UserDataInterface,
  ): Promise<boolean> {
    const { id, accessToken, refreshToken, picture } = userData;
    const updateData = {
      accessToken,
      refreshToken,
      profileImage: picture,
    };

    try {
      if (userType === 'seller') {
        await this.prisma.sellerSocialAccount.update({
          where: { serviceId: id },
          data: updateData,
        });
      } else if (userType === 'broadcaster') {
        await this.prisma.broadcasterSocialAccount.update({
          where: { serviceId: id },
          data: updateData,
        });
      } else if (userType === 'customer') {
        await this.prisma.customerSocialAccount.update({
          where: { serviceId: id },
          data: updateData,
        });
      }
      return true;
    } catch (error) {
      console.error(
        `error in updateSocialAccountRecord, userType:${userType}, userData: ${userData}`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  /** userType에 따른 소셜계정 테이블에서 accessToken 혹은 refreshToken 가져오기 */
  private async getSocialAccountToken(params: {
    userType: UserType;
    tokenType: 'accessToken' | 'refreshToken';
    provider: string;
    serviceId: string;
  }): Promise<string> {
    const { userType, provider, serviceId, tokenType } = params;
    let socialAccount:
      | (SellerSocialAccount & {
          seller: Seller;
        })
      | (BroadcasterSocialAccount & {
          broadcaster: Broadcaster;
        })
      | (CustomerSocialAccount & {
          customer: Customer;
        });

    // 판매자
    if (userType === 'seller') {
      socialAccount = await this.selectSellerSocialAccountRecord({
        provider,
        id: serviceId,
      });
    } else if (userType === 'broadcaster') {
      // 방송인
      socialAccount = await this.selectBroadcasterSocialAccountRecord({
        provider,
        id: serviceId,
      });
    } else if (userType === 'customer') {
      // 방송인
      socialAccount = await this.selectCustomerSocialAccountRecord({
        provider,
        id: serviceId,
      });
    }

    if (!socialAccount) {
      throw new BadRequestException(
        `해당 서비스로 연동된 계정이 존재하지 않음 provider: ${provider}, serviceId: ${serviceId}, userType: ${userType}`,
      );
    }
    return socialAccount[tokenType];
  }

  /**
   * 카카오 계정 연동해제 & 카카오 소셜계정 레코드 삭제
   * @param accessTokenParam 액세스토큰. 인수로 제공되지 않는 경우, DB에서 가져와 사용한다. @by hwasurr
   * */
  async kakaoUnlink(
    userType: UserType,
    kakaoId: string,
    accessTokenParam?: string,
  ): Promise<boolean> {
    let kakaoAccessToken: string;
    if (!accessTokenParam) {
      kakaoAccessToken = await this.getSocialAccountToken({
        userType,
        provider: 'kakao',
        tokenType: 'accessToken',
        serviceId: kakaoId,
      });
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
        const socialAccount = await this.selectSellerSocialAccountRecord({
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
  async naverUnlink(
    userType: UserType,
    naverId: string,
    accessTokenParam?: string,
  ): Promise<boolean> {
    let naverAccessToken: string;
    if (!accessTokenParam) {
      naverAccessToken = await this.getSocialAccountToken({
        userType,
        provider: 'naver',
        tokenType: 'accessToken',
        serviceId: naverId,
      });
    } else {
      naverAccessToken = accessTokenParam;
    }
    // 네이버 계정연동 해제 요청
    try {
      const isSuccess = await this.naver.unlink(naverAccessToken);
      if (!isSuccess) {
        // 액세스 토큰 만료로 인한 실패의 경우, 액세스 토큰 리프레시 이후 연동 해제 진행
        const socialAccount = await this.selectSellerSocialAccountRecord({
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
  async googleUnlink(
    userType: UserType,
    googleId: string,
    accessTokenParam?: string,
  ): Promise<boolean> {
    let googleAccessToken: string;
    if (!accessTokenParam) {
      googleAccessToken = await this.getSocialAccountToken({
        userType,
        provider: 'google',
        tokenType: 'accessToken',
        serviceId: googleId,
      });
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
        const socialAccountRefreshToken = await this.getSocialAccountToken({
          userType,
          provider: 'google',
          tokenType: 'refreshToken',
          serviceId: googleId,
        });
        // 액세스 토큰 리프레시
        const refreshRes = await this.google.refreshAccessToken(
          socialAccountRefreshToken,
        );
        await this.google.unlink(refreshRes.access_token);
        return true;
      }
      throw new InternalServerErrorException(error);
    }
  }

  /** userType에 맞는 테이블에서 email로 유저 검색 후 해당 유저의 소셜계정 목록 반환 */
  async getSocialAccounts(userType: UserType, email: string): Promise<SocialAccounts> {
    const selectFields = {
      serviceId: true,
      provider: true,
      name: true,
      registDate: true,
      profileImage: false,
      accessToken: false,
      refreshToken: false,
    };
    // userType === 'seller' 판매자인 경우
    if (userType === 'seller') {
      const seller = await this.prisma.seller.findUnique({
        where: { email },
        select: {
          socialAccounts: {
            select: { ...selectFields, sellerId: false },
          },
        },
      });
      return seller.socialAccounts;
    }
    // userType === 'customer' 소비자인 경우
    if (userType === 'customer') {
      const seller = await this.prisma.customer.findUnique({
        where: { email },
        select: {
          socialAccounts: {
            select: { ...selectFields, customerId: false },
          },
        },
      });
      return seller.socialAccounts;
    }
    // userType === 'broadcaster' 방송인인 경우
    const broadcaster = await this.prisma.broadcaster.findUnique({
      where: { email },
      select: {
        socialAccounts: {
          select: { ...selectFields, broadcasterId: false },
        },
      },
    });
    return broadcaster.socialAccounts;
  }
}

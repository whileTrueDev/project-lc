import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InactiveSeller, Prisma, Seller, SellerSocialAccount } from '@prisma/client';
import { ImageResizer, UserPwManager } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  AdminSellerListRes,
  FindSellerRes,
  sellerCommonInfoDefaultText,
  SellerContractionAgreementDto,
} from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userPwManager: UserPwManager,
    private readonly imageResizer: ImageResizer,
  ) {}

  /**
   * 회원 가입
   */
  async signUp(signUpInput: Prisma.SellerCreateInput): Promise<Seller> {
    const hashedPw = await this.userPwManager.hashPassword(signUpInput.password);
    const seller = await this.prisma.seller.create({
      data: {
        email: signUpInput.email,
        name: signUpInput.name,
        password: hashedPw,
        agreementFlag: true,
        goodsCommonInfo: {
          create: {
            info_name: '기본',
            info_value: sellerCommonInfoDefaultText,
          },
        },
      },
    });
    return seller;
  }

  /**
   * 로그인
   */
  async login(email: string, pwdInput: string): Promise<Seller | InactiveSeller | null> {
    const user = await this.findOne({ email });
    let inactiveUser;
    if (!user) {
      inactiveUser = await this.findInactiveOne({ email });
      if (!inactiveUser) {
        throw new UnauthorizedException();
      }
    }
    if (user?.password === null || inactiveUser?.password === null) {
      // 소셜로그인으로 가입된 회원
      throw new BadRequestException();
    }
    const isCorrect = await this.userPwManager.validatePassword(
      pwdInput,
      user?.password || inactiveUser?.password,
    );
    if (!isCorrect) {
      throw new UnauthorizedException();
    }

    if (inactiveUser) {
      return inactiveUser;
    }
    return user;
  }

  /**
   * 유저 정보 조회
   */
  async findOne(findInput: Prisma.SellerWhereUniqueInput): Promise<FindSellerRes> {
    const seller = await this.prisma.seller.findUnique({
      where: findInput,
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        avatar: true,
        agreementFlag: true,
        inactiveFlag: true,
        sellerShop: {
          select: {
            shopName: true,
          },
        },
      },
    });

    if (!seller) {
      return seller;
    }
    // seller shop name preprocessing
    const { sellerShop, ..._seller } = seller;
    return {
      ..._seller,
      shopName: sellerShop?.shopName ? sellerShop.shopName : null,
    };
  }

  /**
   * 휴면 유저 정보 조회
   */
  async findInactiveOne(
    findInput: Prisma.SellerWhereUniqueInput,
  ): Promise<InactiveSeller> {
    const seller = await this.prisma.inactiveSeller.findUnique({
      where: findInput,
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        avatar: true,
        inactiveFlag: true,
        agreementFlag: true,
      },
    });

    if (!seller) {
      return seller;
    }
    return seller;
  }

  /**
   * 이메일 주소가 중복되는 지 체크합니다.
   * @param email 중복체크할 이메일 주소
   * @returns {boolean} 중복되지않아 괜찮은 경우 true, 중복된 경우 false
   */
  async isEmailDupCheckOk(email: string): Promise<boolean> {
    const user = await this.prisma.seller.findFirst({ where: { email } });
    const inactiveUser = await this.prisma.inactiveSeller.findFirst({ where: { email } });
    if (user || inactiveUser) return false;

    return true;
  }

  /**
   * 해당 이메일로 가입된 계정이 삭제될 수 있는지 확인함
   * @throws {Error}
   */
  private async checkCanBeDeletedSeller(email: string): Promise<boolean> {
    const seller = await this.prisma.seller.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        socialAccounts: true,
      },
    });

    if (!seller) {
      throw new BadRequestException('해당 계정이 존재하지 않습니다.');
    }

    if (seller.socialAccounts.length !== 0) {
      throw new BadRequestException(
        '연결된 소셜 계정이 존재합니다. 연결 해제를 먼저 진행해주세요.',
      );
    }

    return !!seller;
  }

  /**
   * seller 삭제
   */
  async deleteOne(email: string): Promise<boolean> {
    await this.checkCanBeDeletedSeller(email);
    await this.prisma.seller.delete({ where: { email } });
    return true;
  }

  /**
   * 입력된 이메일을 가진 유저가 본인 인증을 하기 위해 비밀번호를 확인함
   * @param email 본인 이메일
   * @param password 본인 비밀번호
   * @returns boolean 비밀번호가 맞는지
   */
  async checkPassword(email: string, password: string): Promise<boolean> {
    const seller = await this.findOne({ email });
    return this.userPwManager.checkPassword(seller, password);
  }

  /**
   * 비밀번호 변경
   * @param email 비밀번호 변경할 셀러의 email
   * @param newPassword 새로운 비밀번호
   * @returns
   */
  async changePassword(email: string, newPassword: string): Promise<Seller> {
    const hashedPw = await this.userPwManager.hashPassword(newPassword);
    const seller = await this.prisma.seller.update({
      where: { email },
      data: { password: hashedPw },
    });
    return seller;
  }

  /** 셀러 아바타 이미지 url 저장 */
  public async addSellerAvatar(
    email: Seller['email'],
    file: Express.Multer.File,
  ): Promise<boolean> {
    const size = 200;
    const resized = await this.imageResizer.resize(file.buffer, size);
    const avatarUrl = await s3.uploadProfileImage({
      key: `${size}x${size}_${file.originalname}`,
      file: resized,
      email,
      userType: 'seller',
    });
    await this.prisma.seller.update({
      where: { email },
      data: { avatar: avatarUrl },
    });
    return true;
  }

  /** 셀러 아바타 이미지 url null 로 초기화 */
  public async removeSellerAvatar(email: Seller['email']): Promise<boolean> {
    await this.prisma.seller.update({
      where: { email },
      data: { avatar: null },
    });
    return true;
  }

  /** 전체 판매자 계정과 상점명 목록 조회 */
  public async getSellerList(): Promise<AdminSellerListRes> {
    return this.prisma.seller.findMany({
      select: {
        sellerShop: true,
        id: true,
        email: true,
        name: true,
        avatar: true,
        inactiveFlag: true,
        sellerBusinessRegistration: {
          include: {
            BusinessRegistrationConfirmation: true,
          },
        },
        sellerSettlementAccount: true,
        SellerContacts: true,
      },
    });
  }

  public async updateAgreementFlag(dto: SellerContractionAgreementDto): Promise<Seller> {
    const seller = await this.prisma.seller.update({
      where: { id: dto.id },
      data: {
        agreementFlag: dto.agreementFlag,
      },
    });
    return seller;
  }

  /** 휴면 계정 데이터 복구 */
  public async restoreInactiveSeller(email: Seller['email']): Promise<Seller> {
    const restoreData = await this.prisma.inactiveSeller.findFirst({
      where: { email },
    });

    const restoreSocialData = await this.prisma.inactiveSellerSocialAccount.findFirst({
      where: { sellerId: restoreData.id },
    });

    if (restoreSocialData) {
      await this.restoreInactiveSocialSeller(restoreSocialData);
    }

    return this.prisma.seller.update({
      where: {
        id: restoreData.id,
      },
      data: {
        email: restoreData.email,
        name: restoreData.name,
        avatar: restoreData.avatar,
        password: restoreData.password,
        inactiveFlag: false,
      },
    });
  }

  private async restoreInactiveSocialSeller(
    restoreSocialData: SellerSocialAccount,
  ): Promise<SellerSocialAccount> {
    return this.prisma.sellerSocialAccount.create({
      data: {
        serviceId: restoreSocialData.serviceId,
        provider: restoreSocialData.provider,
        name: restoreSocialData.name,
        registDate: restoreSocialData.registDate,
        profileImage: restoreSocialData.profileImage,
        accessToken: restoreSocialData.accessToken,
        refreshToken: restoreSocialData.refreshToken,
        sellerId: restoreSocialData.sellerId,
      },
    });
  }

  /** 휴면 계정 데이터 복구 */
  public async deleteInactiveSeller(sellerId: Seller['id']): Promise<InactiveSeller> {
    return this.prisma.inactiveSeller.delete({
      where: {
        id: sellerId,
      },
    });
  }
}

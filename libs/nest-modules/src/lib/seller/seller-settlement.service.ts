import { Injectable } from '@nestjs/common';
import {
  SellerBusinessRegistration,
  SellerSettlementAccount,
  BusinessRegistrationConfirmation,
  SellerSettlements,
} from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BusinessRegistrationDto,
  SettlementAccountDto,
  SellerBusinessRegistrationType,
} from '@project-lc/shared-types';
import { UserPayload } from '../auth/auth.interface';

export type SellerSettlementInfo = {
  sellerBusinessRegistration: SellerBusinessRegistrationType[];
  sellerSettlements: {
    date: Date;
    state: number;
    amount: number;
  }[];
  sellerSettlementAccount: Array<
    Pick<SellerSettlementAccount, 'bank' | 'number' | 'name'>
  >;
};

@Injectable()
export class SellerSettlementService {
  constructor(private readonly prisma: PrismaService) {}

  // 사업자 등록증 번호 포맷만들기
  private makeRegistrationNumberFormat(num: string): string {
    // 10자리의 문자열 -> '3-2-5'문자열
    return `${num.slice(0, 3)}-${num.slice(3, 5)}-${num.slice(5)}`;
  }

  /**
   * 사업자 등록증 등록
   * @param dto 사업자 등록증 등록 정보
   * @param sellerInfo 사용자 등록 정보
   */
  async insertBusinessRegistration(
    dto: BusinessRegistrationDto,
    sellerInfo: UserPayload,
  ): Promise<SellerBusinessRegistration> {
    const email = sellerInfo.sub;
    const sellerBusinessRegistration =
      await this.prisma.sellerBusinessRegistration.create({
        data: {
          companyName: dto.companyName,
          sellerEmail: email,
          businessRegistrationNumber: this.makeRegistrationNumberFormat(
            dto.businessRegistrationNumber,
          ),
          representativeName: dto.representativeName,
          businessType: dto.businessType,
          businessItem: dto.businessItem,
          businessAddress: dto.businessAddress,
          taxInvoiceMail: dto.taxInvoiceMail,
          businessRegistrationImageName: dto.businessRegistrationImageName,
          mailOrderSalesImageName: dto.mailOrderSalesImageName,
          mailOrderSalesNumber: dto.mailOrderSalesNumber,
        },
      });
    return sellerBusinessRegistration;
  }

  /**
   * 정산 정보 등록 후, 검수 정보를 위한 테이블에 레코드 추가
   * 정산 정보 등록 후 autoincrement되는 id 번호를 사용해야하므로 등록 과정 이후 진행
   * @param sellerBusinessRegistration 삽입된 사업자 등록 정보
   */
  async insertBusinessRegistrationConfirmation(
    _sellerBusinessRegistration: SellerBusinessRegistration,
  ): Promise<BusinessRegistrationConfirmation> {
    const businessRegistrationConfirmation =
      await this.prisma.businessRegistrationConfirmation.create({
        data: {
          SellerBusinessRegistrationId: _sellerBusinessRegistration.id,
        },
      });

    return businessRegistrationConfirmation;
  }

  /**
   * 정산 계좌 등록
   * @param dto 정산 계좌 정보
   * @param sellerInfo 사용자 등록 정보
   */
  async insertSettlementAccount(
    dto: SettlementAccountDto,
    sellerInfo: UserPayload,
  ): Promise<SellerSettlementAccount> {
    const email = sellerInfo.sub;
    const settlementAccount = await this.prisma.sellerSettlementAccount.create({
      data: {
        sellerEmail: email,
        name: dto.name,
        number: dto.number,
        bank: dto.bank,
        settlementAccountImageName: dto.settlementAccountImageName,
      },
    });

    return settlementAccount;
  }

  /**
   * 정산 정보 조회
   * @param sellerInfo 사용자 등록 정보
   */
  async selectSellerSettlementInfo(
    sellerInfo: UserPayload,
  ): Promise<SellerSettlementInfo> {
    const email = sellerInfo.sub;
    const settlementInfo = await this.prisma.seller.findUnique({
      where: {
        email,
      },
      select: {
        sellerBusinessRegistration: {
          include: {
            BusinessRegistrationConfirmation: true,
          },
          take: 1,
          orderBy: {
            id: 'desc',
          },
        },
        sellerSettlements: {
          take: 5,
          orderBy: {
            id: 'desc',
          },
          select: {
            date: true,
            state: true,
            amount: true,
          },
        },
        sellerSettlementAccount: {
          take: 1,
          orderBy: {
            id: 'desc',
          },
          select: {
            bank: true,
            number: true,
            name: true,
          },
        },
      },
    });

    return settlementInfo;
  }

  // *****************************
  // * 👇 실제 정산 처리 관련
  // *****************************

  /**
   * 정산 처리를 진행합니다.
   * @author hwasurr(dan)
   * */
  public async settle(): Promise<void> {
    // 정산 대상 불러오기
  }

  /**
   * 정산 완료 목록을 조회합니다.
   * @author hwasurr(dan)
   */
  public async findSettlementHistory(
    sellerInfo: UserPayload,
  ): Promise<SellerSettlements[]> {
    return this.prisma.sellerSettlements.findMany({
      where: { sellerEmail: sellerInfo.sub },
      include: {
        settlementItems: { include: { options: true } },
        liveShopping: true,
      },
    });
  }
}

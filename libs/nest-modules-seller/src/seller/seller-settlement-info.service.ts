/* eslint-disable no-nested-ternary */
import { Injectable } from '@nestjs/common';
import {
  BusinessRegistrationConfirmation,
  ConfirmHistory,
  InactiveBusinessRegistrationConfirmation,
  Seller,
  SellerBusinessRegistration,
  SellerSettlementAccount,
} from '@prisma/client';
import { UserPayload } from '@project-lc/nest-core';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BusinessRegistrationDto,
  ConfirmHistoryDto,
  SellerBusinessRegistrationType,
  SettlementAccountDto,
} from '@project-lc/shared-types';

export type SellerSettlementInfo = {
  sellerBusinessRegistration: SellerBusinessRegistrationType[];
  sellerSettlements: {
    date: Date;
    state: number;
    totalAmount: number;
  }[];
  sellerSettlementAccount: Array<
    Pick<SellerSettlementAccount, 'bank' | 'number' | 'name'>
  >;
};

@Injectable()
export class SellerSettlementInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cipherService: CipherService,
  ) {}

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
    const sellerId = sellerInfo.id;
    const sellerBusinessRegistration =
      await this.prisma.sellerBusinessRegistration.create({
        data: {
          companyName: dto.companyName,
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
          sellerId,
        },
      });
    return sellerBusinessRegistration;
  }

  /**
   * 휴면 사업자 등록증 confirmation 상태 복구
   * @param sellerId
   */
  public async restoreInactiveBusinessRegistrationConfirmation(
    sellerId: Seller['id'],
  ): Promise<BusinessRegistrationConfirmation | null> {
    const restoreData = await this.prisma.inactiveSellerBusinessRegistration.findFirst({
      where: {
        sellerId,
      },
      select: {
        InactiveBusinessRegistrationConfirmation: {
          select: {
            id: true,
            status: true,
            rejectionReason: true,
            InactiveSellerBusinessRegistrationId: true,
          },
        },
      },
    });

    if (restoreData?.InactiveBusinessRegistrationConfirmation) {
      return this.prisma.businessRegistrationConfirmation.create({
        data: {
          id: restoreData.InactiveBusinessRegistrationConfirmation.id,
          status: restoreData.InactiveBusinessRegistrationConfirmation.status,
          rejectionReason:
            restoreData.InactiveBusinessRegistrationConfirmation.rejectionReason,
          SellerBusinessRegistrationId:
            restoreData.InactiveBusinessRegistrationConfirmation
              .InactiveSellerBusinessRegistrationId,
        },
      });
    }
    return null;
  }

  /**
   * 휴면 사업자 등록증 confirmation 삭제
   * @param sellerId
   */
  public async deleteInactiveBusinessRegistrationConfirmation(
    registrationId: number,
  ): Promise<InactiveBusinessRegistrationConfirmation> {
    return this.prisma.inactiveBusinessRegistrationConfirmation.delete({
      where: {
        InactiveSellerBusinessRegistrationId: registrationId,
      },
    });
  }

  /**
   * 휴면 사업자 등록증 복구
   * @param dto 사업자 등록증 등록 정보
   * @param sellerInfo 사용자 등록 정보
   */
  public async restoreInactiveBusinessRegistration(
    sellerId: Seller['id'],
  ): Promise<void> {
    const restoreData = await this.prisma.inactiveSellerBusinessRegistration.findFirst({
      where: {
        sellerId,
      },
    });
    if (restoreData) {
      await this.prisma.sellerBusinessRegistration.create({
        data: {
          id: restoreData.id,
          companyName: restoreData.companyName,
          businessRegistrationNumber: this.makeRegistrationNumberFormat(
            restoreData.businessRegistrationNumber,
          ),
          representativeName: restoreData.representativeName,
          businessType: restoreData.businessType,
          businessItem: restoreData.businessItem,
          businessAddress: restoreData.businessAddress,
          taxInvoiceMail: restoreData.taxInvoiceMail,
          businessRegistrationImageName: restoreData.businessRegistrationImageName,
          mailOrderSalesImageName: restoreData.mailOrderSalesImageName,
          mailOrderSalesNumber: restoreData.mailOrderSalesNumber,
          sellerId,
        },
      });
    }
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
    const sellerId = sellerInfo.id;

    const encryptedAccountNumber = this.cipherService.getEncryptedText(dto.number);
    const settlementAccount = await this.prisma.sellerSettlementAccount.create({
      data: {
        sellerId,
        name: dto.name,
        number: encryptedAccountNumber,
        bank: dto.bank,
        settlementAccountImageName: dto.settlementAccountImageName,
      },
    });

    return settlementAccount;
  }

  /**
   * 정산 계좌 등록
   * @param dto 정산 계좌 정보
   * @param sellerInfo 사용자 등록 정보
   */
  public async restoreSettlementAccount(sellerId: Seller['id']): Promise<void> {
    const restoreData = await this.prisma.inactiveSellerSettlementAccount.findFirst({
      where: {
        sellerId,
      },
    });

    if (restoreData) {
      await this.prisma.sellerSettlementAccount.create({
        data: {
          sellerId: restoreData.sellerId,
          name: restoreData.name,
          number: restoreData.number,
          bank: restoreData.bank,
          settlementAccountImageName: restoreData.settlementAccountImageName,
        },
      });
    }
  }

  /**
   * 정산 정보 조회
   * @param sellerInfo 사용자 등록 정보
   */
  async selectSellerSettlementInfo(
    sellerInfo: UserPayload,
  ): Promise<SellerSettlementInfo> {
    const sellerId = sellerInfo.id;
    const settlementInfo = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      select: {
        sellerBusinessRegistration: {
          include: { BusinessRegistrationConfirmation: true },
          take: 1,
          orderBy: { id: 'desc' },
        },
        sellerSettlements: {
          take: 5,
          orderBy: { id: 'desc' },
          select: { date: true, state: true, totalAmount: true },
        },
        sellerSettlementAccount: {
          take: 1,
          orderBy: { id: 'desc' },
          select: { bank: true, number: true, name: true },
        },
      },
    });

    const { sellerSettlementAccount } = settlementInfo;
    const decryptedSettlementAccount = sellerSettlementAccount.map((data) => ({
      ...data,
      number: this.cipherService.getDecryptedText(data.number), // 계좌번호 복호화처리
    }));

    return { ...settlementInfo, sellerSettlementAccount: decryptedSettlementAccount };
  }

  /** 판매자 정산정보 / 사업자등록증 / 계좌정보 검수내역 생성 */
  public createSettlementConfirmHistory(dto: ConfirmHistoryDto): Promise<ConfirmHistory> {
    const { type } = dto;
    const { sellerSettlementAccountId } = dto;

    if (type === 'settlementAccount' && sellerSettlementAccountId) {
      return this.prisma.confirmHistory.create({
        data: {
          sellerSettlementAccountId,
          type: dto.type,
          status: dto.status,
        },
      });
    }
    if (type === 'businessRegistration') {
      return this.prisma.confirmHistory.create({
        data: {
          sellerBusinessRegistrationId: dto.sellerBusinessRegistrationId,
          type: dto.type,
          status: dto.status,
        },
      });
    }
    if (type === 'mailOrder') {
      return this.prisma.confirmHistory.create({
        data: {
          sellerBusinessRegistrationId: dto.sellerBusinessRegistrationId,
          type: dto.type,
          status: dto.status,
        },
      });
    }
    return this.prisma.confirmHistory.create({
      data: {
        broadcasterSettlementInfoId: dto.broadcasterSettlementInfoId,
        type: dto.type,
        status: dto.status,
      },
    });
  }

  /** 판매자 정산정보 / 사업자등록증 / 계좌정보 검수내역 조회 */
  public getSettlementConfirmHistory(user: UserPayload): Promise<ConfirmHistory[]> {
    const { type } = user;
    const { id } = user;

    if (type === 'seller') {
      return this.prisma.confirmHistory.findMany({
        where: {
          OR: [
            {
              sellerBusinessRegistration: {
                sellerId: id,
              },
            },
            {
              sellerSettlementAccount: {
                sellerId: id,
              },
            },
          ],
        },
        orderBy: {
          createDate: 'desc',
        },
        take: 7,
      });
    }

    return this.prisma.confirmHistory.findMany({
      where: {
        broadcasterSettlementInfo: {
          broadcasterId: id,
        },
      },
      orderBy: {
        createDate: 'desc',
      },
      take: 7,
    });
  }
}

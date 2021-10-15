import { Injectable } from '@nestjs/common';
import { BusinessRegistrationConfirmation } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BusinessRegistrationConfirmationDto,
  BusinessRegistrationRejectionDto,
  BusinessRegistrationStatus,
} from '@project-lc/shared-types';

@Injectable()
export class AdminSettlementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사업자등록정보 반려를 수행하는 함수
   * @param dto 반려입력정보
   * @returns 반려가 반영된 입력정보, 변경여부를 판단하기 위한 기준으로 사용
   */
  public async setBusinessRegistrationRejection(
    dto: BusinessRegistrationRejectionDto,
  ): Promise<BusinessRegistrationConfirmation> {
    const businessRegistrationConfirmation =
      await this.prisma.businessRegistrationConfirmation.update({
        where: { SellerBusinessRegistrationId: dto.id },
        data: {
          status: BusinessRegistrationStatus.REJECTED,
          rejectionReason: dto.rejectionReason,
        },
      });

    if (!businessRegistrationConfirmation) {
      throw new Error(`승인 상태 변경불가`);
    }

    return businessRegistrationConfirmation;
  }

  /**
   * 사업자등록정보 승인를 수행하는 함수
   * @param dto 승인입력정보
   * @returns 승인이 반영된 입력정보, 변경여부를 판단하기 위한 기준으로 사용
   */
  public async setBusinessRegistrationConfirmation(
    dto: BusinessRegistrationConfirmationDto,
  ): Promise<BusinessRegistrationConfirmation> {
    // 동일한 퍼스트몰 상품번호로 검수된 상품이 없다면(중복이 아닌 경우) 그대로 검수 확인 진행
    const businessRegistrationConfirmation =
      await this.prisma.businessRegistrationConfirmation.update({
        where: { SellerBusinessRegistrationId: dto.id },
        data: {
          status: BusinessRegistrationStatus.CONFIRMED,
        },
      });

    if (!businessRegistrationConfirmation) {
      throw new Error(`승인 상태 변경불가`);
    }

    return businessRegistrationConfirmation;
  }
}

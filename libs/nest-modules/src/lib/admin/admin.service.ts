import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { SellerSettlementAccount, SellerBusinessRegistration } from '@prisma/client';

export type AdminSettlementInfoType = {
  sellerSettlementAccount: SellerSettlementAccount[];
  sellerBusinessRegistration: SellerBusinessRegistration[];
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 관리자 페이지 정산 데이터
  public async getSettlementInfo() {
    // 전체 광고주를 기준으로 merge 한다.
    const users = await this.prisma.seller.findMany({
      include: {
        sellerBusinessRegistration: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
        sellerSettlementAccount: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
    });

    const result = this.preprocessSettlementInfo(users);
    return result;
  }

  private preprocessSettlementInfo(users: any) {
    const result: AdminSettlementInfoType = {
      sellerSettlementAccount: [],
      sellerBusinessRegistration: [],
    };

    // 단순 데이터를 전달하지 않고 필요한 데이터의형태로 정제해야함.
    users.forEach(({ sellerSettlementAccount, sellerBusinessRegistration }) => {
      if (sellerSettlementAccount.length > 0) {
        result.sellerSettlementAccount.push(sellerSettlementAccount[0]);
      }
      if (sellerBusinessRegistration.length > 0) {
        result.sellerBusinessRegistration.push(sellerBusinessRegistration[0]);
      }
    });

    return result;
  }
}

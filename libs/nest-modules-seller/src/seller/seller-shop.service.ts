import { Injectable } from '@nestjs/common';
import { UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { SellerShopInfoDto } from '@project-lc/shared-types';

@Injectable()
export class SellerShopService {
  constructor(private readonly prisma: PrismaService) {}

  // 상점에 대한 정보 변경
  async changeShopInfo(dto: SellerShopInfoDto, sellerInfo: UserPayload): Promise<void> {
    const sellerShop = await this.prisma.sellerShop.upsert({
      where: { sellerEmail: sellerInfo.sub },
      update: { ...dto },
      create: {
        sellerEmail: sellerInfo.sub,
        shopName: dto.shopName,
      },
    });

    if (!sellerShop) {
      throw new Error(`상점명 변경불가`);
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { SellerShopInfoDto } from '@project-lc/shared-types';

@Injectable()
export class SellerShopService {
  constructor(private readonly prisma: PrismaService) {}

  /** 상점 대한 정보 변경 */
  async changeShopInfo(dto: SellerShopInfoDto, sellerInfo: UserPayload): Promise<void> {
    const sellerShop = await this.prisma.sellerShop.upsert({
      where: { sellerId: sellerInfo.id },
      update: { ...dto },
      create: {
        sellerId: sellerInfo.id,
        shopName: dto.shopName,
      },
    });

    if (!sellerShop) {
      throw new InternalServerErrorException(`상점명 변경불가`);
    }
  }
}

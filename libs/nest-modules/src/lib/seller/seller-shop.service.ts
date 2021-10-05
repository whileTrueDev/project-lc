import { Injectable } from '@nestjs/common';
import { SellerShopInfoDto } from '@project-lc/shared-types';
import { PrismaService } from '@project-lc/prisma-orm';
import { UserPayload } from '../auth/auth.interface';

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

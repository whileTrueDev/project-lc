import { Injectable } from '@nestjs/common';
import { SellerShopInfoDto } from '@project-lc/shared-types';
import { PrismaService } from '@project-lc/prisma-orm';
import { UserPayload } from '../auth/auth.interface';

@Injectable()
export class SellerShopService {
  constructor(private readonly prisma: PrismaService) {}

  async changeShopInfo(dto: SellerShopInfoDto, sellerInfo: UserPayload) {
    const seller = await this.prisma.seller.update({
      where: { email: sellerInfo.sub },
      data: {
        shopName: dto.shopName,
      },
    });
    if (!seller) {
      throw new Error(`상점명 변경불가`);
    }
  }
}

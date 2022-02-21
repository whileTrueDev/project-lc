import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache, UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { SellerShopInfoDto } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class SellerShopService extends ServiceBaseWithCache {
  #SELLER_SHOP_CACHE_KEY = 'seller';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  // 상점에 대한 정보 변경
  async changeShopInfo(dto: SellerShopInfoDto, sellerInfo: UserPayload): Promise<void> {
    const sellerShop = await this.prisma.sellerShop.upsert({
      where: { sellerId: sellerInfo.id },
      update: { ...dto },
      create: {
        sellerId: sellerInfo.id,
        shopName: dto.shopName,
      },
    });

    await this._clearCaches(this.#SELLER_SHOP_CACHE_KEY);

    if (!sellerShop) {
      throw new Error(`상점명 변경불가`);
    }
  }
}

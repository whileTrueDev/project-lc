import { Injectable } from '@nestjs/common';
import { KkshowShoppingTab } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { parseJsonToGenericType } from '@project-lc/utils';

@Injectable()
export class KkshowShoppingService {
  constructor(private readonly prisma: PrismaService) {}

  private async findFirst(): Promise<KkshowShoppingTab> {
    return this.prisma.kkshowShoppingTab.findFirst();
  }

  private jsonToResType(data: KkshowShoppingTab): KkshowShoppingTabResData {
    return {
      carousel: parseJsonToGenericType<KkshowShoppingTabResData['carousel']>(
        data.carousel,
      ),
      goodsOfTheWeek: parseJsonToGenericType<KkshowShoppingTabResData['goodsOfTheWeek']>(
        data.goodsOfTheWeek,
      ),
      newLineUp: parseJsonToGenericType<KkshowShoppingTabResData['newLineUp']>(
        data.newLineUp,
      ),
      popularGoods: parseJsonToGenericType<KkshowShoppingTabResData['popularGoods']>(
        data.popularGoods,
      ),
      recommendations: parseJsonToGenericType<
        KkshowShoppingTabResData['recommendations']
      >(data.recommendations),
      reviews: parseJsonToGenericType<KkshowShoppingTabResData['reviews']>(data.carousel),
      keywords: parseJsonToGenericType<KkshowShoppingTabResData['keywords']>(
        data.keywords,
      ),
    };
  }

  public async read(): Promise<KkshowShoppingTabResData> {
    const data = await this.findFirst();
    if (data) return this.jsonToResType(data);
    return null;
  }
}

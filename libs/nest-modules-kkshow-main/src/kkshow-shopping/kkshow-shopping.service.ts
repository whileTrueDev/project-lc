import { Injectable } from '@nestjs/common';
import { KkshowShoppingTab } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { KkshowShoppingDto, KkshowShoppingTabResData } from '@project-lc/shared-types';
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
      reviews: parseJsonToGenericType<KkshowShoppingTabResData['reviews']>(data.reviews),
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

  /** 크크쇼메인데이터 생성(데이터가 없는 경우) 혹은 수정(데이터가 존재하는 경우) */
  async upsert(data: KkshowShoppingDto): Promise<KkshowShoppingTabResData> {
    const existData = await this.findFirst();

    if (existData) {
      const updated = await this.prisma.kkshowShoppingTab.update({
        where: { id: existData.id },
        data,
      });
      return this.jsonToResType(updated);
    }
    const created = await this.prisma.kkshowShoppingTab.create({
      data,
    });
    return this.jsonToResType(created);
  }
}

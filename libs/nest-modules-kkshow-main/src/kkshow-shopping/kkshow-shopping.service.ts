import { Injectable } from '@nestjs/common';
import {
  KkshowShoppingSectionItem,
  KkshowShoppingTab,
  KkshowShoppingTabSectionOrder,
} from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  KkshowShoppingDto,
  KkshowShoppingTabCarouselItem,
  KkshowShoppingTabResData,
  LAYOUT_CAROUSEL,
} from '@project-lc/shared-types';
import { parseJsonToGenericType } from '@project-lc/utils';

@Injectable()
export class KkshowShoppingService {
  constructor(private readonly prisma: PrismaService) {}

  /** @deprecated */
  private async findFirst(): Promise<KkshowShoppingTab> {
    return this.prisma.kkshowShoppingTab.findFirst();
  }

  /** @deprecated */
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
      banner: parseJsonToGenericType<KkshowShoppingTabResData['banner']>(data.banner),
    };
  }

  /** @deprecated */
  public async read(): Promise<KkshowShoppingTabResData> {
    const data = await this.findFirst();
    if (data) return this.jsonToResType(data);
    return null;
  }

  /** @deprecated */
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

  /** 섹션 순서 조회 */
  public async getSectionOrder(): Promise<number[]> {
    const data = await this.prisma.kkshowShoppingTabSectionOrder.findFirst();
    if (!data) return [];
    return parseJsonToGenericType(data.order);
  }

  /** 섹션 순서 수정 */
  public async updateSectionOrder(order: number[]): Promise<boolean> {
    const data = await this.prisma.kkshowShoppingTabSectionOrder.findFirst();
    if (!data) {
      await this.prisma.kkshowShoppingTabSectionOrder.create({
        data: { order },
      });
      return true;
    }
    console.log('exist data', data, order);
    await this.prisma.kkshowShoppingTabSectionOrder.update({
      where: { id: data.id },
      data: { order },
    });
    return true;
  }

  /** 섹션 데이터 조회
   * @params ids : KkshowShoppingSectionItem['id'][]
   * ids 배열이 주어질 경우, 해당 id에 해당하는 SectionItem만 조회한다(ids 에 주어진 순서대로 정렬하여 리턴함)
   *
   */
  public async getSections(ids?: number[]): Promise<KkshowShoppingSectionItem[]> {
    if (!ids || !ids.length) return this.prisma.kkshowShoppingSectionItem.findMany();

    const list = await this.prisma.kkshowShoppingSectionItem.findMany({
      where: { id: { in: ids } },
    });

    const sortedList = ids
      .map((id, index) => {
        const sectionItem = list.find((item) => item.id === id);
        return { index, sectionItem };
      })
      .filter((itemWithIndex) => !!itemWithIndex.sectionItem)
      .sort((a, b) => a.index - b.index)
      .map((itemWithIndex) => itemWithIndex.sectionItem);

    return sortedList;
  }

  /** 캐러셀 섹션 데이터 조회 */
  public async getCarouselSection(): Promise<KkshowShoppingSectionItem> {
    return this.prisma.kkshowShoppingSectionItem.findFirst({
      where: { layoutType: LAYOUT_CAROUSEL },
    });
  }

  /** 섹션데이터 수정 */
  public async updateSectionData(
    id: number,
    dto: Omit<KkshowShoppingSectionItem, 'id'>,
  ): Promise<boolean> {
    await this.prisma.kkshowShoppingSectionItem.update({
      where: { id },
      data: dto,
    });
    return true;
  }

  /** 섹션데이터 삭제 */
  public async deleteSectionData(id: number): Promise<boolean> {
    await this.prisma.kkshowShoppingSectionItem.delete({ where: { id } });
    return true;
  }

  /** 섹션데이터 생성 */
  public async createSectionData(
    dto: Pick<KkshowShoppingSectionItem, 'layoutType' | 'data' | 'title'>,
  ): Promise<KkshowShoppingSectionItem> {
    return this.prisma.kkshowShoppingSectionItem.create({
      data: dto,
    });
  }
}

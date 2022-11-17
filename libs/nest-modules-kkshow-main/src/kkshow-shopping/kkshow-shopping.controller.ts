import { Controller, Get } from '@nestjs/common';
import { GoodsCategoryService } from '@project-lc/nest-modules-goods-category';
import {
  GoodsCategoryWithFamily,
  KkshowShoppingTabResData,
  KkshowShoppingSectionsResData,
} from '@project-lc/shared-types';
import { KkshowShoppingCategoryService } from './kkshow-shopping-category.service';
import { KkshowShoppingService } from './kkshow-shopping.service';

@Controller('kkshow-shopping')
export class KkshowShoppingController {
  constructor(
    private readonly kkshowShoppingService: KkshowShoppingService,
    private readonly shoppingCategoryService: KkshowShoppingCategoryService,
    private readonly goodsCategoryService: GoodsCategoryService,
  ) {}

  /** @deprecated 크크마켓 페이지에 표시할 데이터를 조회하기 위해 대신 @Get('sections') 를 사용합니다
   */
  @Get()
  getKkshowShoppingData(): Promise<KkshowShoppingTabResData | null> {
    return this.kkshowShoppingService.read();
  }

  /** 크크마켓(크크쇼.com/쇼핑) 페이지에 표시할 카테고리 조회 */
  @Get('categories')
  public async getCategoriesToDisplay(): Promise<GoodsCategoryWithFamily[]> {
    const codes = await this.shoppingCategoryService.findAll();
    return this.goodsCategoryService.findCategoriesByCodes(codes);
  }

  /** 크크마켓(크크쇼.com/쇼핑) 페이지에 표시할 섹션 순서 & 섹션 데이터 조회 */
  @Get('sections')
  public async getKkshowShoppingSections(): Promise<KkshowShoppingSectionsResData> {
    const orders = await this.kkshowShoppingService.getSectionOrder();
    const sectionItemsInOrder = await this.kkshowShoppingService.getSections(orders);
    const carouselSection = await this.kkshowShoppingService.getCarouselSection();
    return { sectionItems: sectionItemsInOrder, carousel: carouselSection };
  }
}

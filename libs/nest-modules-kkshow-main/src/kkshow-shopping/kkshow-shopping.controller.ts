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

  @Get()
  getKkshowShoppingData(): Promise<KkshowShoppingTabResData | null> {
    return this.kkshowShoppingService.read();
  }

  @Get('categories')
  public async getCategoriesToDisplay(): Promise<GoodsCategoryWithFamily[]> {
    const codes = await this.shoppingCategoryService.findAll();
    return this.goodsCategoryService.findCategoriesByCodes(codes);
  }

  @Get('sections')
  public async getKkshowShoppingSections(): Promise<KkshowShoppingSectionsResData> {
    const orders = await this.kkshowShoppingService.getSectionOrder();
    const sectionItemsInOrder = await this.kkshowShoppingService.getSections(orders);
    const carouselSection = await this.kkshowShoppingService.getCarouselSection();
    return { sectionItems: sectionItemsInOrder, carousel: carouselSection };
  }
}

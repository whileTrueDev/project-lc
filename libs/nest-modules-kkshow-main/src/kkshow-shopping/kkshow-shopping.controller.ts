import { Controller, Get } from '@nestjs/common';
import { GoodsCategoryService } from '@project-lc/nest-modules-goods-category';
import {
  GoodsCategoryWithFamily,
  KkshowShoppingTabResData,
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
    console.log(codes);
    return this.goodsCategoryService.findCategoriesByCodes(codes);
  }
}

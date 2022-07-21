import { Controller, Get } from '@nestjs/common';
import { GoodsCategoryService } from '@project-lc/nest-modules-goods-category';
import {
  GoodsCategoryWithFamily,
  KkshowShoppingTabResData,
} from '@project-lc/shared-types';
import { KkshowShoppingService } from './kkshow-shopping.service';

@Controller('kkshow-shopping')
export class KkshowShoppingController {
  constructor(
    private readonly kkshowShoppingService: KkshowShoppingService,
    private readonly goodsCategoryService: GoodsCategoryService,
  ) {}

  @Get()
  getKkshowShoppingData(): Promise<KkshowShoppingTabResData | null> {
    return this.kkshowShoppingService.read();
  }

  @Get('categories')
  public async getCategoriesToDisplay(): Promise<GoodsCategoryWithFamily[]> {
    // TODO: 임시값. 크크마켓 카테고리 목록 UI + UI관리 작업에서 크크마켓에 표시할 카테고리 목록을 불러오도록 구성
    const codes = [
      '3OODwX2OsE8nUeu79ca59',
      'dcVxki4tX7nJOExarqAbi',
      '4bAH23CrgZ7xP1oAs2C0I',
    ];
    return this.goodsCategoryService.findCategoriesByCodes(codes);
  }
}

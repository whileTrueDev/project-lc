import { KkshowShoppingTabCategory } from '@prisma/client';
import { IsString } from 'class-validator';

export class KkshowShoppingTabCategoryDto {
  @IsString() categoryCode: KkshowShoppingTabCategory['goodsCategoryCode'];
}

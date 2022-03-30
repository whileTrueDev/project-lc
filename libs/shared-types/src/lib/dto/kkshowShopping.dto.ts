import { Prisma } from '@prisma/client';
import { IsJSON } from 'class-validator';
import KkshowShoppingTabResData from '../res-types/kkshowShoppingTab.res';

type Keys = keyof KkshowShoppingTabResData;
type IKkshowShoppingDto = Record<Keys, Prisma.JsonArray | Prisma.JsonObject>;

export class KkshowShoppingDto implements IKkshowShoppingDto {
  @IsJSON() carousel: Prisma.JsonArray;
  @IsJSON() goodsOfTheWeek: Prisma.JsonArray;
  @IsJSON() newLineUp: Prisma.JsonArray;
  @IsJSON() popularGoods: Prisma.JsonArray;
  @IsJSON() recommendations: Prisma.JsonArray;
  @IsJSON() reviews: Prisma.JsonArray;
  @IsJSON() keywords: Prisma.JsonArray;
  @IsJSON() banner: Prisma.JsonObject;
}

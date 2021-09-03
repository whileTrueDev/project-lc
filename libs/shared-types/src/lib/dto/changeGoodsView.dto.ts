import { GoodsView } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class ChangeGoodsViewDto {
  @IsEnum(GoodsView)
  view: GoodsView;

  @IsNumber()
  id: number;
}

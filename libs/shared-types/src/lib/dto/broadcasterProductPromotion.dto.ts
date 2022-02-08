import { IsInt } from 'class-validator';

export class broadcasterProductPromotionDto {
  @IsInt() fmGoodsSeq: number;
}

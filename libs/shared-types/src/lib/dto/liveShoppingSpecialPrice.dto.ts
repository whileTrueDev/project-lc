import { AmountUnit } from '@prisma/client';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

/** 라이브쇼핑 특가 등록 dto */
export class LiveShoppingSpecialPriceRegistDto {
  @IsNumber()
  specialPrice: number;

  @IsNumber()
  goodsId: number;

  @IsNumber()
  goodsOptionId: number;

  @IsIn(['P', 'W'])
  discountType: AmountUnit;

  @IsNumber()
  @IsOptional()
  discountRate?: number;
}

/** 라이브쇼핑 특가 수정 dto */
export class LiveShoppingSpecialPriceUpdateDto {
  @IsOptional()
  @IsNumber()
  specialPrice?: number;

  @IsOptional()
  @IsNumber()
  goodsId?: number;

  @IsOptional()
  @IsNumber()
  goodsOptionId?: number;

  @IsOptional()
  @IsNumber()
  liveShoppingId?: number;

  @IsOptional()
  @IsIn(['P', 'W'])
  discountType?: AmountUnit;

  @IsNumber()
  @IsOptional()
  discountRate?: number;
}

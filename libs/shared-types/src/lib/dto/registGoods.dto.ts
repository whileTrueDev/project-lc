import {
  GoodsStatus,
  GoodsView,
  LimitOrUnlimit,
  OptionViewType,
  RunoutPolicy,
  ShopOrGoods,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GoodsImageDto } from './goodsImage.dto';
import { GoodsOptionDto } from './goodsOption.dto';

/** 상품 키워드 DTO */
class GoodsSearchKeywordDto {
  @IsString()
  keyword: string;
}

export class RegistGoodsDto {
  @IsString()
  goods_name: string;

  @IsString()
  summary: string;

  @IsIn(['normal', 'runout', 'purchasing', 'unsold'])
  goods_status: GoodsStatus;

  @IsIn(['0', '1'])
  cancel_type: string; // 청약철회 가능 여부, "0" or "1"

  @IsString()
  @IsOptional()
  contents?: string;

  @IsString()
  @IsOptional()
  contents_mobile?: string;

  @IsIn(['shop', 'goods'])
  shipping_policy: ShopOrGoods;

  @IsIn(['unlimit', 'limit'])
  goods_shipping_policy: LimitOrUnlimit;

  @IsOptional()
  @IsNumber()
  unlimit_shipping_price?: number;

  @IsOptional()
  @IsNumber()
  limit_shipping_ea?: number;

  @IsOptional()
  @IsNumber()
  limit_shipping_price?: number;

  @IsOptional()
  @IsNumber()
  limit_shipping_subprice?: number;

  @IsIn(['shop', 'goods'])
  shipping_weight_policy: ShopOrGoods;

  @IsIn(['unlimit', 'limit'])
  min_purchase_limit: LimitOrUnlimit;

  @IsOptional()
  @IsNumber()
  min_purchase_ea?: number;

  @IsIn(['unlimit', 'limit'])
  max_purchase_limit: LimitOrUnlimit;

  @IsOptional()
  @IsNumber()
  max_purchase_ea?: number;

  @IsOptional()
  @IsNumber()
  max_urchase_order_limit?: number;

  @IsOptional()
  @IsString()
  admin_memo?: string;

  @IsIn(['0', '1'])
  option_use: string; // 옵션 사용 여부 "0" or "1"

  @IsIn(['divide', 'join'])
  option_view_type: OptionViewType;

  @IsIn(['0', '1'])
  option_suboption_use: string; // 추가 옵션 사용 여부 "0" or "1"

  @IsIn(['0', '1'])
  member_input_use: string; // 추가 구성 옵션 사용 여부 "0" or "1"

  @ValidateNested({ each: true })
  @Type(() => GoodsImageDto)
  image: GoodsImageDto[];

  @IsIn(['look', 'notLook'])
  goods_view: GoodsView;

  @IsOptional()
  @IsIn(['stock', 'ableStock', 'unlimited'])
  runout_policy?: RunoutPolicy;

  @ValidateNested({ each: true })
  @Type(() => GoodsOptionDto)
  options: GoodsOptionDto[];

  @IsOptional()
  @IsNumber()
  shippingGroupId?: number;

  @IsOptional()
  @IsNumber()
  goodsInfoId?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GoodsSearchKeywordDto)
  searchKeywords?: GoodsSearchKeywordDto[] = [];

  // TODO : array로 바꾸기
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber({}, { each: true })
  categoryIdList: number[];

  @IsOptional()
  @IsNumber()
  informationNoticeId?: number;

  @IsOptional()
  @IsJSON()
  informationNoticeContents?: string;
}

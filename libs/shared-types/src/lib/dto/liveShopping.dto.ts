import {
  Broadcaster,
  LiveShopping,
  LiveShoppingImage,
  LiveShoppingImageType,
  LiveShopppingProgressType,
  Seller,
  TtsSetting,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { LiveShoppingInput } from '../..';
import { LIVE_SHOPPING_PROGRESS } from '../constants/liveShoppingProgress';
import { LiveShoppingSpecialPriceRegistDto } from './liveShoppingSpecialPrice.dto';

/** 라이브쇼핑 메시지 설정 업데이트 DTO */
export class LiveShoppingMessageSettingUpdateDTO {
  @IsOptional() @IsString() fanNick?: string;
  @IsOptional() @IsEnum(TtsSetting) ttsSetting?: TtsSetting;
  @IsOptional() @Type(() => Number) @IsNumber() levelCutOffPoint?: number;
}

/** 라이브쇼핑 업데이트 dto */
export class LiveShoppingUpdateDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  broadcasterId?: number;

  @IsNumber()
  @IsOptional()
  sellerId?: string;

  @IsNumber()
  @IsOptional()
  goodsId?: number;

  @IsNumber()
  @IsOptional()
  contactId?: number;

  @IsOptional()
  @IsString()
  requests?: string;

  @IsString()
  @IsOptional()
  progress?: LiveShopppingProgressType;

  @IsOptional()
  @IsDate()
  broadcastStartDate?: string;

  @IsOptional()
  @IsDate()
  broadcastEndDate?: string;

  @IsOptional()
  @IsDate()
  sellStartDate?: string;

  @IsOptional()
  @IsDate()
  sellEndDate?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsNumber()
  videoUrl: string;

  @ValidateIf((o) => o.progress === LIVE_SHOPPING_PROGRESS.확정됨)
  @IsNumber()
  @IsNotEmpty()
  whiletrueCommissionRate?: string;

  @ValidateIf((o) => o.progress === LIVE_SHOPPING_PROGRESS.확정됨)
  @IsNumber()
  @IsNotEmpty()
  broadcasterCommissionRate?: string;

  @IsOptional() @IsString() liveShoppingName?: LiveShopping['liveShoppingName'];

  @IsOptional()
  @IsString()
  liveShoppingImage?: Pick<LiveShoppingImage, 'imageUrl' | 'type'>;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => LiveShoppingMessageSettingUpdateDTO)
  messageSetting?: LiveShoppingMessageSettingUpdateDTO;
}

/** 라이브쇼핑 등록 dto */
export class LiveShoppingRegistDTO {
  @IsString()
  requests: LiveShopping['requests'];

  @IsNumber()
  goodsId: LiveShopping['goodsId'];

  @IsNumber()
  contactId: LiveShopping['contactId'];

  @IsString()
  desiredPeriod: LiveShoppingInput['desiredPeriod'];

  @IsString()
  @IsOptional()
  desiredCommission?: LiveShoppingInput['desiredCommission'];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LiveShoppingSpecialPriceRegistDto)
  specialPrices?: LiveShoppingSpecialPriceRegistDto[];
}

export class FindLiveShoppingDto {
  @Type(() => Number) @IsOptional() @IsNumber() id?: LiveShopping['id'];
  @Type(() => Number) @IsOptional() @IsNumber() broadcasterId?: Broadcaster['id'];
  @Type(() => Number) @IsOptional() @IsNumber() sellerId?: Seller['id'];
  @IsOptional() @IsArray() goodsIds?: number[];
}
export type LiveShoppingBroadcastDate = Pick<
  LiveShopping,
  'broadcastStartDate' | 'broadcastEndDate'
>;

export type LiveShoppingsWithBroadcasterAndGoodsName = Pick<
  LiveShopping,
  'id' | 'broadcastStartDate' | 'broadcastEndDate'
> & {
  broadcaster: {
    email: string;
    userNickname: string;
    overlayUrl: string;
  };
  goods: {
    goods_name: string;
  };
};

export type LiveShoppingId = Pick<LiveShopping, 'id'>;

export class LiveShoppingImageDto {
  @IsNumber()
  liveShoppingId: number;

  @IsEnum(LiveShoppingImageType)
  imageType: LiveShoppingImageType;

  @IsString()
  imageUrl: string;
}

export class CreateLiveShoppingExternalGoodsDto {
  @IsString() name: string;

  @IsString() linkUrl: string;

  @IsString() @IsOptional() imageUrl?: string;
}

/** 관리자로 라이브쇼핑 등록 dto
 * 판매자
 * 판매자의 상품 | 외부상품
 */
export class LiveShoppingRegistByAdminDto {
  @IsNumber()
  sellerId: LiveShopping['sellerId'];

  @ValidateIf((dto) => !dto.externalGoods)
  @IsOptional()
  goodsId?: LiveShopping['goodsId'];

  @ValidateIf((dto) => !dto.goodsId)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateLiveShoppingExternalGoodsDto)
  externalGoods?: CreateLiveShoppingExternalGoodsDto;
}

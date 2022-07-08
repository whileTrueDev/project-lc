import {
  Broadcaster,
  LiveShopping,
  LiveShoppingImage,
  LiveShoppingImageType,
  LiveShopppingProgressType,
  Seller,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { LiveShoppingInput } from '../..';
import { LIVE_SHOPPING_PROGRESS } from '../constants/liveShoppingProgress';

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

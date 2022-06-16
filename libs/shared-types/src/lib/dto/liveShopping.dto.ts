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
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { LiveShoppingInput } from '../..';
import { LIVE_SHOPPING_PROGRESS } from '../constants/liveShoppingProgress';

export class LiveShoppingDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  broadcasterId: number;

  @IsString()
  sellerId: string;

  @IsNumber()
  goods_id: number;

  @IsNumber()
  contactId: number;

  @IsOptional()
  @IsString()
  requests: string;

  @IsString()
  progress: LiveShopppingProgressType;

  @IsOptional()
  @IsDate()
  broadcastStartDate: Date;

  @IsOptional()
  @IsDate()
  broadcastEndDate: Date;

  @IsOptional()
  @IsDate()
  sellStartDate: string;

  @IsOptional()
  @IsDate()
  sellEndDate: string;

  @IsOptional()
  @IsString()
  rejectionReason: string;

  @IsOptional()
  @IsNumber()
  videoUrl: string;

  @IsDate()
  createDate: string;

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

export type LiveShoppingRegistDTO = Pick<
  LiveShoppingDTO,
  'requests' | 'goods_id' | 'contactId' | 'progress'
> &
  Pick<LiveShoppingInput, 'desiredPeriod' | 'desiredCommission'>;

export type LiveShoppingWithSales = Pick<
  LiveShoppingDTO,
  'id' | 'sellStartDate' | 'sellEndDate'
>;
export class FindLiveShoppingDto {
  @Type(() => Number) @IsOptional() @IsNumber() id?: LiveShopping['id'];
  @Type(() => Number) @IsOptional() @IsNumber() broadcasterId?: Broadcaster['id'];
  @Type(() => Number) @IsOptional() @IsNumber() sellerId?: Seller['id'];
  @IsOptional() @IsArray() goodsIds?: number[];
}
export type LiveShoppingBroadcastDate = Pick<
  LiveShoppingDTO,
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

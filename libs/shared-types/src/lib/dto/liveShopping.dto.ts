import {
  IsString,
  IsDate,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
  IsInt,
} from 'class-validator';
import { LiveShopping, LiveShopppingProgressType } from '@prisma/client';
import { LIVE_SHOPPING_PROGRESS } from '../constants/liveShoppingProgress';
import { LiveShoppingInput } from '../..';

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

  @IsOptional() @IsInt() fmGoodsSeq?: LiveShopping['fmGoodsSeq'];
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

export interface LiveShoppingWithSalesAndFmId extends LiveShoppingWithSales {
  firstmallGoodsConnectionId: string;
}

export class LiveShoppingParamsDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsArray() goodsIds?: number[];
}

export interface LiveShoppingWithConfirmation extends LiveShopping {
  goods: {
    confirmation: {
      firstmallGoodsConnectionId: number;
    };
  };
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

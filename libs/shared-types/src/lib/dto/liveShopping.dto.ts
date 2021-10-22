import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { LiveShopppingProgressType } from '@prisma/client';

export class LiveShoppingDTO {
  @IsNumber()
  id: number;

  @IsString()
  streamId: string;

  @IsOptional()
  @IsString()
  broadcasterId: string;

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
  broadcastStartDate: string;

  @IsOptional()
  @IsDate()
  broadcastEndDate: string;

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
}

export type LiveShoppingRegistDTO = Pick<
  LiveShoppingDTO,
  'requests' | 'goods_id' | 'contactId' | 'streamId' | 'progress'
>;

export type LiveShoppingWithSales = Pick<
  LiveShoppingDTO,
  'id' | 'sellStartDate' | 'sellEndDate'
>;

export interface LiveShoppingWithSalesAndFmId extends LiveShoppingWithSales {
  firstmallGoodsConnectionId: string;
}

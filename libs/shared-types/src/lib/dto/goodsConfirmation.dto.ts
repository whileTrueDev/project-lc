import { IsEnum, IsNumber } from 'class-validator';

export enum GoodsConfirmationStatus {
  WAITING = 'waiting',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export class GoodsConfirmationDto {
  @IsNumber()
  goodsId: number;

  @IsNumber()
  firstmallGoodsConnectionId?: number;

  @IsEnum(GoodsConfirmationStatus)
  status: string;
}

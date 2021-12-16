import { IsEnum, IsNumber, IsString } from 'class-validator';

export enum GoodsConfirmationStatus {
  WAITING = 'waiting',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export class GoodsConfirmationDto {
  @IsNumber()
  goodsId: number;

  @IsNumber()
  firstmallGoodsConnectionId: number;

  @IsEnum(GoodsConfirmationStatus)
  status = GoodsConfirmationStatus.CONFIRMED;
}

export class GoodsRejectionDto {
  @IsNumber()
  goodsId: number;

  @IsEnum(GoodsConfirmationStatus)
  status = GoodsConfirmationStatus.REJECTED;

  @IsString()
  rejectionReason: string;
}

export type GoodsConfirmationDtoOnlyConnectionId = Omit<
  GoodsConfirmationDto,
  'goodsId' | 'status'
>;

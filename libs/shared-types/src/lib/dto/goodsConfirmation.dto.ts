import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsOptional() // TODO: optional 삭제
  rejectionReason?: string;
}

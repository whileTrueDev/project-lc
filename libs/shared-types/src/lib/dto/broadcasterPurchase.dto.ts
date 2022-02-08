import { IsInt, IsString } from 'class-validator';
import { SellType } from '@prisma/client';

export class BroadcasterPurchaseDto {
  @IsInt() id: number;
  @IsString() goods_name: string;
  @IsString() settleprice: string;
  @IsString() regist_date: string;
  @IsString() message: string;
}

export type BroacasterPurchaseWithDivdedMessageDto = Omit<
  BroadcasterPurchaseDto,
  'message'
> & {
  sellType: SellType;
  userNickname: string;
  userMessage: string;
};

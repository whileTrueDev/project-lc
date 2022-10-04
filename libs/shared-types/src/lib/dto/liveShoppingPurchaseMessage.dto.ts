import { IsNumber, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class liveShoppingPurchaseMessageDto {
  @IsNumber() id: number;

  @IsString() nickname: string;

  @IsString() text: string;

  @IsNumber() price: number;

  @IsDate() createDate: Date;
}

export type liveShoppingPurchaseMessageNickname = Pick<
  liveShoppingPurchaseMessageDto,
  'nickname'
>;

export class LiveShoppingCurrentPurchaseMessagesDto {
  @Type(() => Number)
  @IsNumber()
  liveShoppingId: number;
}

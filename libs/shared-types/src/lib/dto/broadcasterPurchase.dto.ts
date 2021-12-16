import { IsInt, IsString } from 'class-validator';

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
  userNickname: string;
  userMessage: string;
};

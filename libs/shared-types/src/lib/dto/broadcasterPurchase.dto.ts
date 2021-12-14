import { IsInt, IsString } from 'class-validator';

export class BroadcasterPurchaseDto {
  @IsInt() id: number;
  @IsString() goods_name: string;
  @IsString() settleprice: string;
  @IsString() deposit_date: string;
  @IsString() userNickname: string;
  @IsString() userMessage: string;
}

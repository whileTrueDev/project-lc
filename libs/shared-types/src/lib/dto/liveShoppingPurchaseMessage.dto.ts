import { IsNumber, IsString, IsDate } from 'class-validator';

export class liveShoppingPurchaseMessageDto {
  @IsNumber() id: number;

  @IsString() nickname: string;

  @IsString() text: string;

  @IsNumber() price: number;

  @IsDate() createDate: Date;
}

import { IsIn, IsInt, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { LiveShopping, SellType } from '@prisma/client';
import { Type } from 'class-transformer';
import { FindManyDto } from './findMany.dto';

export class BroadcasterPurchaseDto {
  @IsInt() id: number;
  @IsString() goods_name: string;
  @IsString() settleprice: string;
  @IsString() regist_date: string;
  @IsString() message: string;
}

export type BroacasterPurchaseWithDividedMessageDto = Omit<
  BroadcasterPurchaseDto,
  'message'
> & {
  sellType: SellType;
  userNickname: string;
  userMessage: string;
};

export class FindBroadcasterPurchaseDto extends FindManyDto {
  @IsOptional()
  @IsIn(['liveShopping', 'productPromotion'])
  @IsString()
  by?: Exclude<SellType, 'normal'>;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ValidateIf((obj) => obj.by === 'liveShopping')
  liveShoppinId?: LiveShopping['id'];

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ValidateIf((obj) => obj.by === 'productPromotion')
  productPromotionId?: LiveShopping['id'];
}
export class OrderByBroadcasterDto extends FindManyDto {}

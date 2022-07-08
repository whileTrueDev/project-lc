import { Goods } from '@prisma/client';
import { IsNumberString, IsOptional } from 'class-validator';

export class FindProductPromotionsDto {
  @IsOptional() @IsNumberString({}, { each: true }) goodsIds?: Goods['id'][];
}

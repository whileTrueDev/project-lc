import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsJSON } from 'class-validator';

export class GoodsInformationNoticeDto {
  @IsJSON()
  contents: Prisma.JsonObject;

  @IsOptional()
  @IsNumber()
  goodsId?: number;
}

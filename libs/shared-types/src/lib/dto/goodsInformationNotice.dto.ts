import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional, IsJSON } from 'class-validator';

export class GoodsInformationNoticeDto {
  @IsNumber()
  id: number;

  @IsJSON()
  contents: Prisma.JsonObject;

  @IsNumber()
  goodsId: number;
}

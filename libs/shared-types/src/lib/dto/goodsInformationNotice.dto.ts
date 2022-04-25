import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { GoodsInformationSubjectItems } from './goodsInformationSubject.dto';

export class GoodsInformationNoticeDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsObject()
  @Type(() => GoodsInformationSubjectItems)
  contents: Prisma.JsonObject;

  @IsNumber()
  goodsId: number;
}

import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';

export class GoodsInformationSubjectItems {
  name: string;
  value: string;
}

export class GoodsInformationSubjectDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  subject: string;

  @IsObject()
  @Type(() => GoodsInformationSubjectItems)
  items: Prisma.JsonObject;
}

import { IsJSON, IsNumber, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export interface GoodsInformationSubjectItems {
  name: string;
  value: string;
}

export class GoodsInformationSubjectDto {
  @IsNumber()
  id: number;

  @IsString()
  subject: string;

  @IsJSON()
  items: Prisma.JsonObject;
}

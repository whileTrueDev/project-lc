import { IsJSON, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export interface GoodsInformationSubjectItems {
  name: string;
  value: string;
}

export class GoodsInformationSubjectDto {
  @IsString()
  subject: string;

  @IsJSON()
  items: Prisma.JsonObject;
}

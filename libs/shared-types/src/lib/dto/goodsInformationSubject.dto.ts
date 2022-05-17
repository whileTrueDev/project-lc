import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';

export type GoodsInformationSubjectItems = {
  name: string;
  value: string;
};

export class GoodsInformationSubjectDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  subject: string;

  @IsObject()
  items: GoodsInformationSubjectItems;
}

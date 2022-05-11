import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { GoodsInformationSubjectItems } from './goodsInformationSubject.dto';

export class GoodsInformationNoticeDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsObject()
  contents: GoodsInformationSubjectItems;

  @IsNumber()
  goodsId: number;
}

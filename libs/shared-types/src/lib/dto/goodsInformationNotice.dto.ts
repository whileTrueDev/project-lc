import { IsJSON, IsNumber, IsOptional } from 'class-validator';

export class GoodsInformationNoticeDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsJSON()
  contents: string;

  @IsNumber()
  goodsId: number;
}

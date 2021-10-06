import { IsString, IsNumber } from 'class-validator';

export class GoodsImageDto {
  @IsString()
  image: string;

  @IsNumber()
  cut_number: number;
}

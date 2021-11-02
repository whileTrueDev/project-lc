import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GoodsImageDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  image: string;

  @IsNumber()
  cut_number: number;
}

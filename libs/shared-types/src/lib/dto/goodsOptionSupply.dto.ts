/* eslint-disable camelcase */
import { IsOptional, IsNumber } from 'class-validator';

export class GoodsOptionsSupplyDto {
  @IsNumber()
  stock: number;

  @IsNumber()
  @IsOptional()
  badstock?: number;

  @IsNumber()
  @IsOptional()
  safe_stock?: number;
}

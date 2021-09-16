/* eslint-disable camelcase */
import { YesOrNo, YesOrNo_UPPERCASE } from '@prisma/client';
import { IsIn, IsString, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { GoodsOptionsSupplyDto } from './goodsOptionSupply.dto';

export class GoodsOptionDto {
  @IsIn(['y', 'n'])
  default_option: YesOrNo;

  @IsString()
  option_type: string;

  @IsOptional()
  @IsString()
  option_title?: string;

  @IsOptional()
  @IsString()
  option1?: string;

  @IsOptional()
  @IsString()
  option_code?: string;

  @IsNumber()
  consumer_price: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsIn(['Y', 'N'])
  option_view: YesOrNo_UPPERCASE;

  @ValidateNested()
  @Type(() => GoodsOptionDto)
  supply: GoodsOptionsSupplyDto;
}

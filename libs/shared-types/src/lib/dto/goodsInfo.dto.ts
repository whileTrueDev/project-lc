/* eslint-disable camelcase */
import { IsString } from 'class-validator';

/** 상품공통정보 dto */
export class GoodsInfoDto {
  @IsString()
  info_name: string;

  @IsString()
  info_value: string;
}

/* eslint-disable camelcase */
import { IsNumber, IsString } from 'class-validator';
import {
  ShippingOption,
  ShippingOptType,
  ShippingSetType,
  YesOrNo_UPPERCASE,
} from '.prisma/client';
import { ShippingCostDto } from './shippingCost.dto';

export class ShippingOptionDto
  implements Omit<ShippingOption, 'id' | 'shipping_set_seq'>
{
  @IsString()
  shipping_set_type: ShippingSetType;

  @IsString()
  shipping_opt_type: ShippingOptType;

  @IsString()
  default_yn: YesOrNo_UPPERCASE | null;

  @IsNumber()
  section_st: number | null;

  @IsNumber()
  section_ed: number | null;

  shippingCost: ShippingCostDto;
}

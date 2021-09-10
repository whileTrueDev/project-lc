/* eslint-disable camelcase */
import { IsNumber, IsString } from 'class-validator';
import { ShippingOptType, ShippingSetType, YesOrNo_UPPERCASE } from '.prisma/client';
import { ShippingCost } from './shippingCost.dto';

export class ShippingOption {
  @IsString()
  shipping_set_type: ShippingSetType;

  @IsString()
  shipping_opt_type: ShippingOptType;

  @IsString()
  default_yn?: YesOrNo_UPPERCASE;

  @IsNumber()
  section_st: number | null;

  @IsNumber()
  section_ed: number | null;

  shippingCost: ShippingCost;
}

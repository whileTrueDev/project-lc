/* eslint-disable camelcase */
import { ShippingCalculType, YesOrNo_UPPERCASE } from '@prisma/client';
import { IsString } from 'class-validator';
import { ShippingSet } from './shippingSet.dto';
// import { IsNumber } from 'class-validator';

export class ShippingGroup {
  @IsString()
  shipping_group_name: string;

  @IsString()
  shipping_calcul_type: ShippingCalculType;

  @IsString()
  shipping_calcul_free_yn?: YesOrNo_UPPERCASE;

  @IsString()
  shipping_std_free_yn?: YesOrNo_UPPERCASE;

  @IsString()
  shipping_add_free_yn?: YesOrNo_UPPERCASE;

  @IsString()
  baseAddress: string;

  @IsString()
  detailAddress: string;

  @IsString()
  postalCode: string;

  shippingSets: ShippingSet[];
}

/* eslint-disable camelcase */
import { ShippingCalculType, ShippingGroup, YesOrNo_UPPERCASE } from '@prisma/client';
import { IsString } from 'class-validator';
import { TempShippingSet } from '../constants/shippingTypes';
// import { IsNumber } from 'class-validator';

export class ShippingGroupDto implements Omit<ShippingGroup, 'id' | 'sellerId'> {
  @IsString()
  shipping_group_name: string;

  @IsString()
  shipping_calcul_type: ShippingCalculType;

  @IsString()
  shipping_calcul_free_yn: YesOrNo_UPPERCASE | null;

  @IsString()
  shipping_std_free_yn: YesOrNo_UPPERCASE | null;

  @IsString()
  shipping_add_free_yn: YesOrNo_UPPERCASE | null;

  @IsString()
  baseAddress: string;

  @IsString()
  detailAddress: string;

  @IsString()
  postalCode: string;

  shippingSets: TempShippingSet[];
}

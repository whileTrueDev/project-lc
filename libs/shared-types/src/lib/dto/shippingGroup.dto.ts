import { ShippingCalculType, ShippingGroup, YesOrNo_UPPERCASE } from '@prisma/client';
import { IsIn, IsString, ValidateNested } from 'class-validator';
import { TempShippingSet } from '../constants/shippingTypes';

export class ShippingGroupDto implements Omit<ShippingGroup, 'id' | 'sellerId'> {
  @IsString()
  shipping_group_name: string;

  @IsIn(['free', 'bundle', 'each'])
  shipping_calcul_type: ShippingCalculType;

  @IsIn(['Y', 'N'])
  shipping_calcul_free_yn: YesOrNo_UPPERCASE | null;

  @IsIn(['Y', 'N'])
  shipping_std_free_yn: YesOrNo_UPPERCASE | null;

  @IsIn(['Y', 'N'])
  shipping_add_free_yn: YesOrNo_UPPERCASE | null;

  @IsString()
  baseAddress: string;

  @IsString()
  detailAddress: string;

  @IsString()
  postalCode: string;

  @ValidateNested({ each: true })
  shippingSets: TempShippingSet[];
}

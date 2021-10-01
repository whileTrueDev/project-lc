
import { IsNumber, IsString } from 'class-validator';
import {
  DeliveryNation,
  LimitOrUnlimit,
  PrepayInfo,
  ShippingSetCode,
  YesOrNo_UPPERCASE,
} from '.prisma/client';
import { ShippingSetDtoType, TempShippingOption } from '../constants/shippingTypes';

export class ShippingSetDto implements ShippingSetDtoType {
  @IsString()
  shipping_set_code: ShippingSetCode;

  @IsString()
  shipping_set_name: string;

  @IsString()
  prepay_info: PrepayInfo;

  @IsString()
  default_yn: YesOrNo_UPPERCASE | null;

  @IsString()
  delivery_nation: DeliveryNation;

  @IsString()
  delivery_limit: LimitOrUnlimit;

  @IsNumber()
  refund_shiping_cost: number | null;

  @IsNumber()
  swap_shiping_cost: number | null;

  @IsString()
  shiping_free_yn: YesOrNo_UPPERCASE;

  shippingOptions: TempShippingOption[];
}

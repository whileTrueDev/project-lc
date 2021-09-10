/* eslint-disable camelcase */
import { IsNumber, IsString } from 'class-validator';
import {
  DeliveryNation,
  LimitOrUnlimit,
  PrepayInfo,
  ShippingSetCode,
  YesOrNo_UPPERCASE,
} from '.prisma/client';
import { ShippingOption } from './shippingOption.dto';

export class ShippingSet {
  @IsString()
  shipping_set_code: ShippingSetCode;

  @IsString()
  shipping_set_name: string;

  @IsString()
  prepay_info: PrepayInfo;

  @IsString()
  default_yn?: YesOrNo_UPPERCASE;

  @IsString()
  delivery_nation: DeliveryNation;

  @IsString()
  delivery_limit: LimitOrUnlimit;

  @IsNumber()
  refund_shiping_cost?: number;

  @IsNumber()
  swap_shiping_cost?: number;

  @IsString()
  shiping_free_yn: YesOrNo_UPPERCASE;

  shippingOptions: ShippingOption[];
}

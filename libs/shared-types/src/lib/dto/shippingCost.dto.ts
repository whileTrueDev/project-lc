/* eslint-disable camelcase */
import { IsNumber, IsString } from 'class-validator';

export class ShippingCost {
  @IsNumber()
  shipping_cost: number;

  @IsString()
  shipping_area_name: string;
}

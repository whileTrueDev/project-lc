import { IsNumber, IsString } from 'class-validator';
import { ShippingCostDtoType } from '../constants/shippingTypes';

export class ShippingCostDto implements ShippingCostDtoType {
  @IsNumber()
  shipping_cost: number;

  @IsString()
  shipping_area_name: string;
}

import { IsString } from 'class-validator';
import { FmOrder } from '../..';

export class FindFmOrderDetailsDto {
  @IsString({ each: true })
  orderIds: FmOrder['order_seq'][];
}

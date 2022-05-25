import { Seller } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';
import type { FmSettlementTarget } from '../res-types/fmSettlements.res';

class FmSettlementTargetClass {
  account_date: Date;
  buy_confirm: FmSettlementTarget['buy_confirm'];
  complete_date: FmSettlementTarget['complete_date'];
  confirm_date: FmSettlementTarget['confirm_date'];
  export_code: FmSettlementTarget['export_code'];
  export_seq: FmSettlementTarget['export_seq'];
  options: FmSettlementTarget['options'];
  order_date: FmSettlementTarget['order_date'];
  order_seq: FmSettlementTarget['order_seq'];
  export_date: FmSettlementTarget['export_date'];
  shipping_date: FmSettlementTarget['shipping_date'];
  status: FmSettlementTarget['status'];
  shipping_cost: FmSettlementTarget['shipping_cost'];
}

export class ExecuteSettlementDto {
  @IsNumber()
  sellerId: Seller['id'];

  @Type(() => FmSettlementTargetClass)
  target: FmSettlementTarget;

  @IsString()
  @IsIn(['1', '2'])
  round: '1' | '2';
}

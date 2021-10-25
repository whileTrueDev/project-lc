import { IsIn } from 'class-validator';
import { FmOrderStatus, fmOrderStatusNames } from '../constants/fmOrderStatuses';
import { FmOrderRefundBase } from '../res-types/fmOrder.res';

export class ChangeFmOrderStatusDto {
  @IsIn(fmOrderStatusNames)
  targetStatus: FmOrderStatus['name'];
}

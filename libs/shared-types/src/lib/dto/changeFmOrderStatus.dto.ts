import { IsIn } from 'class-validator';
import { FmOrderStatus, fmOrderStatusNames } from '../constants/fmOrderStatuses';

export class ChangeFmOrderStatusDto {
  @IsIn(fmOrderStatusNames)
  targetStatus: FmOrderStatus['name'];
}

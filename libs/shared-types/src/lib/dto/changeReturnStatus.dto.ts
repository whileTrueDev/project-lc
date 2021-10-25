import { IsIn } from 'class-validator';
import { returnStatusNames } from '@project-lc/shared-types';
import { FmOrderStatus } from '../constants/fmOrderStatuses';

export class ChangeReturnStatusDto {
  @IsIn(returnStatusNames)
  status: FmOrderStatus['name'];
}

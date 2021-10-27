import { IsString, IsIn } from 'class-validator';
import { FmOrderReturnBase } from '../res-types/fmOrder.res';
import { returnStatusNames } from '../constants/fmOrderReturnStatuses';

export class ChangeReturnStatusDto {
  @IsString()
  return_code: string;

  @IsIn(returnStatusNames)
  status: FmOrderReturnBase['status'];
}

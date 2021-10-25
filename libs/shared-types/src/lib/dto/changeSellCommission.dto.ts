import { IsString } from 'class-validator';

export class ChangeSellCommissionDto {
  @IsString()
  commissionRate: string;
}

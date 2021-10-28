import { IsString } from 'class-validator';

export class FindSettlementHistoryDto {
  @IsString()
  round: string | null;
}

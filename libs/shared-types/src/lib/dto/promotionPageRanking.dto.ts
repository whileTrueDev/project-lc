import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';

export enum GetRankingBy {
  'purchasePrice' = 'purchasePrice',
  'giftPrice' = 'giftPrice',
  'reviewCount' = 'reviewCount',
}
export class GetRankingDto {
  @IsEnum(GetRankingBy)
  by: GetRankingBy = GetRankingBy.purchasePrice;

  @IsOptional()
  @IsNumber()
  @IsInt()
  take?: number = 5;
}

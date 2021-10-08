import { IsString } from 'class-validator';

// 정산 계좌번호 DTO
export class SettlementAccountDto {
  // 은행명
  @IsString() bank: string;
  // 계좌번호
  @IsString() number: string;
  // 예금주명
  @IsString() name: string;
  // 통장사본 이미지 명
  @IsString() settlementAccountImageName: string;
}

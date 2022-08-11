import { Return } from '@prisma/client';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class AdminReturnListDto {
  @IsString()
  /** 검색기간  타입
   *  'requestDate' : 환불요청일 */
  searchDateType: keyof Return;

  @IsISO8601()
  @IsOptional()
  /** 검색기간 시작일 */
  searchStartDate?: string | Date;

  @IsISO8601()
  @IsOptional()
  /** 검색기간 종료일 */
  searchEndDate?: string | Date;
}

import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class DefaultPaginationDto {
  /** 목록조회시 skip할 데이터 개수 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  skip?: number;

  /** 목록조회시 조회 할 데이터 개수 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  take?: number = 5;
}

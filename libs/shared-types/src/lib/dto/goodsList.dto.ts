import { IsEnum, IsNumber } from 'class-validator';

// Goods 테이블의 컬럼명
export enum SortColumn {
  REGIST_DATE = 'regist_date',
  GOODS_NAME = 'goods_name',
}
export enum SortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export class GoodsListDto {
  @IsNumber()
  page: number;

  @IsNumber()
  itemPerPage: number;

  @IsEnum(SortColumn)
  sort = SortColumn.REGIST_DATE;

  @IsEnum(SortDirection)
  direction = SortDirection.DESC;
}

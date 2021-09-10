import { IsEnum, IsNumber } from 'class-validator';

// Goods 테이블의 컬럼명
export enum SellerGoodsSortColumn {
  REGIST_DATE = 'regist_date',
  GOODS_NAME = 'goods_name',
}
export enum SellerGoodsSortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export class GoodsListDto {
  @IsNumber()
  page: number;

  @IsNumber()
  itemPerPage: number;

  @IsEnum(SellerGoodsSortColumn)
  sort = SellerGoodsSortColumn.REGIST_DATE;

  @IsEnum(SellerGoodsSortDirection)
  direction = SellerGoodsSortDirection.DESC;
}

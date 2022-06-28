/**
 * 크크쇼 Export 출고데이터 만들기위한 dto
 * 퍼스트몰 출고 생성위한 exportOrder.dto.ts 와 헷갈리지 않도록 별도로 작성함
 *
 * ExportOrderDto.shippingSeq(출고할 배송묶음의 고유번호) 는 fm_order_shipping을 참조하는듯 하나
 * 크크쇼 스키마에 fm_order_shipping(주문과 연결된 배송비정책??)과 대응되는 테이블이 없어 추가하지 않음
 */

import { Exchange, Order, Seller } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { DefaultPaginationDto } from './pagination.dto';

/** 출고상품 생성 dto */
export class KkshowExportItem {
  @IsNumber()
  /**  출고할 주문상품 고유번호 */
  orderItemId: number;

  @IsNumber()
  /**  출고할 주문상품 옵션 고유번호 */
  orderItemOptionId: number;

  @IsNumber()
  /**  출고개수 */
  amount: number;
}

/** 크크쇼 단일출고처리 생성 dto */
export class CreateKkshowExportDto {
  @IsNumber()
  /** 출고와 연결된 주문의 고유번호 */
  orderId: Order['id'];

  @IsString()
  /** 택배사 : 택배사 코드() */
  deliveryCompany: string;

  @IsString()
  /** 운송장번호 */
  deliveryNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KkshowExportItem)
  /** 출고 상품 정보 */
  items: KkshowExportItem[];

  @IsNumber()
  @IsOptional()
  /** 출고 진행한 판매자 고유번호 */
  sellerId?: Seller['id'];

  @IsOptional()
  @IsBoolean()
  /** 재배송 요청에 의한 출고인지 여부 */
  exchangeExportedFlag?: boolean;

  @ValidateIf((d) => !!d.exchangeExportedFlag) // 재배송요청에 의한 출고인 경우에만 확인
  @IsOptional()
  @IsNumber()
  /** 재배송(교환)요청 고유번호 - 재출고와 연결하기 위함 */
  exchangeId?: Exchange['id'];
}

/** 크크쇼 일괄출고처리, 합포장처리 dto */
export class ExportManyDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateKkshowExportDto)
  exportOrders: CreateKkshowExportDto[];
}

/** 출고목록조회 dto */
export class FindExportListDto extends DefaultPaginationDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  /** 출고 진행한 판매자 고유번호 */
  sellerId?: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  orderCode?: string;
}

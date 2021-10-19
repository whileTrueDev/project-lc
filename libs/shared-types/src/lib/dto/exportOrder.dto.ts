import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { fmDeliveryCompanies } from '../constants/fmDeliveryCompanies';
import { FmOrderExport } from '../res-types/fmOrder.res';

class ExportOrderOption {
  /** 출고할 주문상품옵션 고유번호 */
  itemOptionSeq: number;
  /** 출고할 주문상품 고유번호 */
  itemSeq: number;
  /** 출고할 주문상품옵션 수량 */
  exportEa: number;
  /** 출고할 옵션 명 */
  optionTitle: string;
  /** 출고할 옵션 값 */
  option1: string;
}

export class ExportOrderDto {
  /** 출고할 주문의 고유 번호 */
  @IsNumberString()
  orderId: string;

  /** 출고 택배사 */
  @IsString()
  @IsIn(Object.keys(fmDeliveryCompanies))
  deliveryCompanyCode: FmOrderExport['delivery_company_code'];

  /** 출고 송장번호 */
  @IsString()
  deliveryNumber: string;

  /** 출고할 배송묶음의 고유번호 */
  @IsInt()
  shippingSeq: number;

  /** 출고 옵션 정보 */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExportOrderOption)
  exportOptions: ExportOrderOption[];
}

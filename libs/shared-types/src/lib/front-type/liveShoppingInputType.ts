import { LiveShoppingSpecialPrice } from '@prisma/client';
import { LiveShoppingSpecialPriceRegistDto } from '../dto/liveShoppingSpecialPrice.dto';

/** 라이브쇼핑 특가 등록 폼 value */
export interface LiveShoppingSpecialPricesValue {
  specialPrices?: LiveShoppingSpecialPriceRegistDto[];
}

export interface LiveShoppingSpecialPriceDiscountType {
  discountType: LiveShoppingSpecialPrice['discountType'];
  discountRate?: LiveShoppingSpecialPrice['discountRate'];
}

/** 라이브쇼핑 등록 폼 value type */
export interface LiveShoppingInput
  extends LiveShoppingSpecialPricesValue,
    LiveShoppingSpecialPriceDiscountType {
  contactId: number;
  email: string;
  firstNumber: string;
  goods_id: number | null;
  phoneNumber: string;
  requests: string;
  secondNumber: string;
  setDefault: boolean;
  thirdNumber: string;
  useContact: string;

  // 희망 진행 기간
  desiredPeriod: string;
  // 희망 판매 수수료
  desiredCommission: string;
}

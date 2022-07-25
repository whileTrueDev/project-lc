import { MileageStrategy } from '@prisma/client';

// 마일리지 적립방식 한글로 표시 ; noMileage가 기본값임
export const mileageStrategiesToKorean: Record<MileageStrategy, string> = {
  onPaymentPriceExceptMileageUsage: '(결제금액 - 사용한 적립금)기준으로 적립금 지급',
  onPaymentPrice: '전체 결제금액 기준으로 적립금 지급',
  noMileage: '적립금 사용시 적립금 지금안함',
};

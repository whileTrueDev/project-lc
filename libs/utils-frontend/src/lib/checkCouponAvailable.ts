import { CustomerCouponRes } from '@project-lc/shared-types';

/** 쿠폰 사용가능여부 확인
 * @param coupon 쿠폰정보
 * @param orderPrice 주문 총 상품가격
 * @param orderItemIdList 주문할 상품 goodsId 목록
 * @return available: 사용 가능한경우 true 리턴, 불가능한 경우 false 리턴
 * @return reason?: 사용 불가능한 경우 이유 리턴
 */
export function checkCouponAvailable({
  coupon,
  orderPrice,
  orderItemIdList,
}: {
  coupon: CustomerCouponRes['coupon'];
  orderPrice: number;
  orderItemIdList: number[];
}): {
  available: boolean; // 쿠폰 사용 가능 여부
  reason?: string; // 쿠폰사용불가시 이유들
} {
  const {
    unit,
    amount,
    minOrderAmountWon,
    startDate,
    endDate,
    applyField,
    applyType,
    goods,
  } = coupon;

  let available = true;
  const reasons: string[] = [];

  // 주문금액이 쿠폰 할인 금액보다 적은경우 사용불가처리
  if (unit === 'W' && orderPrice < amount) {
    available = false;
    reasons.push('주문 상품금액이 쿠폰 할인금액보다 적습니다.');
  }

  // 최소주문금액 확인
  if (orderPrice < minOrderAmountWon) {
    available = false;
    reasons.push(`주문 상품금액이 ${minOrderAmountWon}원 이상이어야 적용가능합니다.`);
  }

  // 쿠폰적용 가능한 상품 포함되었는지 확인
  if (applyField === 'goods') {
    if (applyType === 'exceptSelectedGoods') {
      // goods 에 포함된 상품 외에 적용 가능한 쿠폰임
      const unavailableGoodsIdList = goods.map((g) => g.id);
      if (orderItemIdList.some((itemId) => unavailableGoodsIdList.includes(itemId))) {
        available = false;
        reasons.push('쿠폰을 적용할 수 없는 상품이 포함되어 있습니다.');
      }
    }
    if (applyType === 'selectedGoods') {
      // goods 에 포함된 상품에만 적용 가능한 쿠폰임
      const availableGoodsIdList = goods.map((g) => g.id);
      if (!orderItemIdList.every((itemId) => availableGoodsIdList.includes(itemId))) {
        available = false;
        reasons.push('쿠폰을 적용할 수 없는 상품이 포함되어 있습니다.');
      }
    }
  }

  // 사용기간 확인
  const now = new Date();
  if ((startDate && new Date(startDate) > now) || (endDate && new Date(endDate) < now)) {
    available = false;
    reasons.push('쿠폰을 사용할 수 있는 기간이 아닙니다.');
  }

  return {
    available,
    reason: reasons.length > 0 ? reasons.join('\n') : undefined,
  };
}

import { LiveShopping } from '@prisma/client';
import dayjs from 'dayjs';

/** 주문이 라이브쇼핑기간 도중 발생한 것인지 판단합니다.
 * @param order 주문 정보
 * @param ls 라이브쇼핑 정보
 */
export function checkOrderDuringLiveShopping(
  order: { order_date: string | Date },
  ls: LiveShopping,
): boolean {
  const { sellStartDate, sellEndDate } = ls;
  const startDate = dayjs(sellStartDate);
  const endDate = dayjs(sellEndDate);
  const _orderDate = dayjs(order.order_date);

  const isAfterThanLiveStart = _orderDate.isAfter(startDate);
  const isBeforeThenLiveEnd = _orderDate.isBefore(endDate);

  if (isAfterThanLiveStart && isBeforeThenLiveEnd && ls.progress === 'confirmed') {
    return true;
  }
  return false;
}

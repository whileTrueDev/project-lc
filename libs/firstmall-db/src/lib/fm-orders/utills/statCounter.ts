import {
  OrderStats,
  SalesStats,
  OrderStatsKeyType,
  SalesStatsKeyType,
  SalesStatsType,
  OrderStatsType,
  FmOrderStatusNumString,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';

type couterProps = {
  count: (
    step: FmOrderStatusNumString,
    regist_date: string | Date,
    payment_price: string,
  ) => void;
  orders: OrderStatsType;
  sales: SalesStatsType;
};

/**
 * 마이페이지의 홈 요약지표를 계산 및 저장을 수행하는 클로저
 * @returns counts 요약지표를 계산하는 함수
 * @returns orders 주문요약지표를 계산하는 함수
 * @returns sales  매출요약지표를 계산하는 함수
 */
export function StatCounter(): couterProps {
  const orders = new OrderStats();
  const sales = new SalesStats();

  const exDay = dayjs().subtract(1, 'day');

  function getOrdersKey(step: FmOrderStatusNumString): OrderStatsKeyType | null {
    const stepNum = parseInt(step, 10);
    if (stepNum >= 35 && stepNum <= 50) {
      return '배송준비중';
    }
    if (stepNum >= 55 && stepNum <= 70) {
      return '배송중';
    }
    if (stepNum === 75) {
      return '배송완료';
    }
    return null;
  }

  function getSalesKey(
    step: FmOrderStatusNumString,
    regist_date: string | Date,
  ): SalesStatsKeyType | null {
    const stepNum = parseInt(step, 10);
    if (exDay.isBefore(dayjs(regist_date))) {
      if (stepNum >= 35 && stepNum <= 75) {
        return '주문';
      }
      if (stepNum === 85) {
        return '환불';
      }
    }
    return null;
  }

  function setOrders(step: FmOrderStatusNumString): void {
    const key = getOrdersKey(step);
    if (key) {
      orders[key] += 1;
    }
  }

  function setSales(
    step: FmOrderStatusNumString,
    regist_date: string | Date,
    payment_price: string,
  ): void {
    const key = getSalesKey(step, regist_date);
    if (key) {
      sales[key].count += 1;
      sales[key].sum += parseInt(payment_price, 10);
    }
  }

  function count(
    step: FmOrderStatusNumString,
    regist_date: string | Date,
    payment_price: string,
  ): void {
    setOrders(step);
    setSales(step, regist_date, payment_price);
  }

  return {
    count,
    orders,
    sales,
  };
}

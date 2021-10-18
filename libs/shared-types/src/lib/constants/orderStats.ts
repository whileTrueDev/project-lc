// 매출현황의 데이터의 형태
export class OrderStats {
  배송준비중 = 0;
  배송중 = 0;
  배송완료 = 0;
}

// 주문현황의 데이터의 형태
export class SalesStats {
  주문 = {
    count: 0,
    sum: 0,
  };

  환불 = {
    count: 0,
    sum: 0,
  };
}

export const orderKeys = Object.keys(new OrderStats());
export const salesKeys = Object.keys(new SalesStats());

// 판매현황 데이터의 형태
export type SalesStatsType = InstanceType<typeof SalesStats>;

// 주문현황 데이터의 형태
export type OrderStatsType = InstanceType<typeof OrderStats>;

// 요약 지표 데이터의 형태
export type OrderStatsRes = {
  orders: OrderStatsType;
  sales: SalesStatsType;
};

export type OrderStatsKeyType = keyof OrderStatsType;
export type SalesStatsKeyType = keyof SalesStatsType;

import { OrderItemOption } from '@prisma/client';
import { SummaryList } from '@project-lc/components-core/SummaryList';
import { OrderDetailRes, OrderItemWithRelations } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { FaBoxOpen, FaShoppingBag, FaUser } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';

export interface OrderDetailSummaryProps {
  order: OrderDetailRes;
}
export function OrderDetailSummary({ order }: OrderDetailSummaryProps): JSX.Element {
  const totalType = order.orderItems.length;
  const totalEa = order.orderItems
    .flatMap((oi: OrderItemWithRelations) => oi.options)
    .reduce((sum: number, cur: OrderItemOption) => sum + cur.quantity, 0);
  return (
    <SummaryList
      spacing={2}
      listItems={[
        {
          id: '주문일시',
          icon: MdDateRange,
          value: `주문일시 ${dayjs(order.createDate).format(
            'YYYY년 MM월 DD일 HH:mm:ss',
          )}`,
        },
        {
          id: '주문자',
          icon: FaUser,
          value: `주문자 ${order.ordererName}`,
        },
        {
          id: '수령자',
          icon: FaBoxOpen,
          value: `수령자 ${order.recipientName}`,
        },
        {
          disabled: !(totalType || totalEa),
          id: '총 주문 종류 및 수량',
          icon: FaShoppingBag,
          value: `주문상품 종류 총 ${totalType} 종, 주문상품 수량 총 ${totalEa} 개`,
        },
        // TODO: 주문-배송비 테이블 생성 후 작업하기
        // {
        //   id: '배송비',
        //   icon: FaShippingFast,
        //   value: (() => {
        //     const cost = Number(order.totalShippingCost);
        //     if (Number.isNaN(cost) || cost === 0) return '무료배송';
        //     let costFieldName = '배송비';
        //     if (order.shippings.length > 1) {
        //       costFieldName = '총 배송비';
        //     }
        //     return `${costFieldName} ${getLocaleNumber(order.totalShippingCost)}원`;
        //   })(),
        // },
      ]}
    />
  );
}

export default OrderDetailSummary;

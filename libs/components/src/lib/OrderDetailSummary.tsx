import {
  convertOrderSitetypeToString,
  FindFmOrderDetailRes,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { AiTwotoneEnvironment } from 'react-icons/ai';
import { FaBoxOpen, FaShippingFast, FaShoppingBag, FaUser } from 'react-icons/fa';

import { MdDateRange } from 'react-icons/md';
import { SummaryList } from './SummaryList';

export interface OrderDetailSummaryProps {
  order: FindFmOrderDetailRes;
}
export function OrderDetailSummary({ order }: OrderDetailSummaryProps): JSX.Element {
  return (
    <SummaryList
      spacing={2}
      listItems={[
        {
          id: '주문일시',
          icon: MdDateRange,
          value: `주문일시 ${dayjs(order.regist_date).format(
            'YYYY년 MM월 DD일 HH:mm:ss',
          )}`,
        },
        {
          id: '주문자',
          icon: FaUser,
          value: `주문자 ${order.order_user_name}`,
        },
        {
          id: '수령자',
          icon: FaBoxOpen,
          value: `수령자 ${order.recipient_user_name}`,
        },
        {
          id: '주문환경',
          icon: AiTwotoneEnvironment,
          value: `${convertOrderSitetypeToString(order.sitetype)}에서 주문`,
        },
        {
          disabled: !(order.totalType || order.totalEa),
          id: '총 주문 종류 및 수량',
          icon: FaShoppingBag,
          value: `주문상품 종류 총 ${order.totalType} 종, 주문상품 수량 총 ${order.totalEa} 개`,
        },
        {
          id: '배송비',
          icon: FaShippingFast,
          value: (() => {
            const cost = Number(order.totalShippingCost);
            if (Number.isNaN(cost) || cost === 0) return '무료배송';
            let costFieldName = '배송비';
            if (order.shippings.length > 1) {
              costFieldName = '총 배송비';
            }
            return `${costFieldName} ${Number(
              order.totalShippingCost,
            ).toLocaleString()}원`;
          })(),
        },
      ]}
    />
  );
}

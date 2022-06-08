import { OrderShippingCheckDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export interface OrderShippingCheck {
  _field: 'default field';
}

/** 배송비정보 타입 */
export type OrderShippingData = Record<
  number, // 배송비그룹 id
  {
    isShippingAvailable?: boolean;
    cost: { std: number; add: number } | null; // 기본배송비, 추가배송비
    items: number[]; // 해당배송비에 포함된 goodsId[]
  }
>;

export const getOrderShippingCheck = async (
  dto?: OrderShippingCheckDto,
): Promise<OrderShippingData> => {
  return axios
    .get<OrderShippingData>('/order/shipping/check', { params: dto })
    .then((res) => res.data);
};

export const useGetOrderShippingCheck = (
  dto?: OrderShippingCheckDto,
): UseQueryResult<OrderShippingData, AxiosError> => {
  return useQuery<OrderShippingData, AxiosError>(
    'GetOrderShippingCheck',
    () => getOrderShippingCheck(dto),
    { enabled: !!dto },
  );
};

import {
  OrderShippingCheckDto,
  ShippingCostByShippingGroupId,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export interface OrderShippingCheck {
  _field: 'default field';
}

/** 배송비정보 타입 */
export type OrderShippingData = ShippingCostByShippingGroupId;
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

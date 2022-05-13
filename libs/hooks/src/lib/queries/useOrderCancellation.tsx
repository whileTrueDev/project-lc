import { GetOrderCancellationListDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export interface OrderCancellation {
  _field: 'default field';
}

export const getOrderCancellation = async (
  dto: GetOrderCancellationListDto,
): Promise<OrderCancellation> => {
  return axios
    .get<OrderCancellation>('/order/cancellation/list', { params: dto })
    .then((res) => res.data);
};

/** 소비자 주문취소요청 목록조회 훅 */
export const useCustomerOrderCancellationList = (
  dto: GetOrderCancellationListDto,
): UseQueryResult<OrderCancellation, AxiosError> => {
  return useQuery<OrderCancellation, AxiosError>(
    ['OrderCancellationList', dto.customerId],
    () => getOrderCancellation(dto),
    { enabled: !!dto.customerId },
  );
};

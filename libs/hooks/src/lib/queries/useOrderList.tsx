import { GetOrderListDto, OrderListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getOrderList = async (dto: GetOrderListDto): Promise<OrderListRes> => {
  return axios.get<OrderListRes>('/order/list', { params: dto }).then((res) => res.data);
};

export const useOrderList = (
  dto: GetOrderListDto,
  enabled: boolean,
): UseQueryResult<OrderListRes, AxiosError> => {
  return useQuery<OrderListRes, AxiosError>(['OrderList', dto], () => getOrderList(dto), {
    initialData: { orders: [], count: 0 },
    enabled,
  });
};

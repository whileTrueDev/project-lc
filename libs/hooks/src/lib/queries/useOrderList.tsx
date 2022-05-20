import { GetOrderListDto, OrderListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import axios from '../../axios';

export const getOrderList = async (dto: GetOrderListDto): Promise<OrderListRes> => {
  return axios.get<OrderListRes>('/order', { params: dto }).then((res) => res.data);
};

export const useOrderList = (
  dto: GetOrderListDto,
  { enabled }: { enabled: boolean },
): UseQueryResult<OrderListRes, AxiosError> => {
  return useQuery<OrderListRes, AxiosError>(['OrderList', dto], () => getOrderList(dto), {
    initialData: { orders: [], count: 0 },
    enabled,
  });
};

// 주문 목록 조회 infinited query
export const INFINITE_ORDER_LIST_QUERY_KEY = 'InfiniteOrderList';
export const useInfiniteOrderList = (
  dto: GetOrderListDto,
): UseInfiniteQueryResult<OrderListRes, AxiosError> => {
  return useInfiniteQuery(
    INFINITE_ORDER_LIST_QUERY_KEY,
    ({ pageParam = 0 }) => getOrderList({ ...dto, skip: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor; // 이 값이 undefined 이면 hasNextPage = false가 됨
      },
    },
  );
};

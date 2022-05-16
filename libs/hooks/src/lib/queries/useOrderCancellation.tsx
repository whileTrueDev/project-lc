import {
  GetOrderCancellationListDto,
  OrderCancellationListRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import axios from '../../axios';

export const getOrderCancellation = async (
  dto: GetOrderCancellationListDto,
): Promise<OrderCancellationListRes> => {
  return axios
    .get<OrderCancellationListRes>('/order/cancellation/list', { params: dto })
    .then((res) => res.data);
};

/** 소비자 주문취소요청 목록조회 훅 */
export const useCustomerInfiniteOrderCancellationList = (
  dto: GetOrderCancellationListDto,
): UseInfiniteQueryResult<OrderCancellationListRes, AxiosError> => {
  return useInfiniteQuery(
    ['InfiniteCustomerOrderCancellation', dto.customerId],
    ({ pageParam = 0 }) => getOrderCancellation({ ...dto, skip: pageParam }),
    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
  );
};

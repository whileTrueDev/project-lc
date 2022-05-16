import {
  GetOrderCancellationListDto,
  OrderCancellationDetailRes,
  OrderCancellationListRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import axios from '../../axios';

export const getOrderCancellationList = async (
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
    ({ pageParam = 0 }) => getOrderCancellationList({ ...dto, skip: pageParam }),
    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
  );
};

export const getOrderCancellationDetail = async (
  cancelCode: string,
): Promise<OrderCancellationDetailRes> => {
  return axios
    .get('/order/cancellation/detail', { params: { cancelCode } })
    .then((res) => res.data);
};

/** 소비자 특정 주문취소요청 상세조회 훅 */
export const useCustomerOrderCancellationDetail = (
  cancelCode: string,
): UseQueryResult<OrderCancellationDetailRes, AxiosError> => {
  return useQuery(
    ['customerOrderCancellationDetail', cancelCode],
    () => getOrderCancellationDetail(cancelCode),
    {
      enabled: !!cancelCode,
    },
  );
};

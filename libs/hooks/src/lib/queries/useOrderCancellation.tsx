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

/** 소비자 주문취소요청 목록조회 쿼리키 */
export const INFINITE_ORDER_CANCEL_LIST_QUERY_KEY = 'InfiniteCustomerOrderCancellation';

/** 소비자 주문취소요청 목록조회 훅 */
export const useCustomerInfiniteOrderCancellationList = (
  dto: GetOrderCancellationListDto,
): UseInfiniteQueryResult<OrderCancellationListRes, AxiosError> => {
  return useInfiniteQuery(
    [INFINITE_ORDER_CANCEL_LIST_QUERY_KEY, dto.customerId],
    ({ pageParam = 0 }) => getOrderCancellationList({ ...dto, skip: pageParam }),
    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
  );
};

export const getOrderCancellationDetail = async (
  cancelCode: string,
): Promise<OrderCancellationDetailRes> => {
  return axios.get(`/order/cancellation/${cancelCode}`).then((res) => res.data);
};

/** 소비자 특정 주문취소요청 상세조회 쿼리키 */
export const CUSTOMER_ORDER_CANCEL_DETAIL_QUERY_KEY = 'customerOrderCancellationDetail';

/** 소비자 특정 주문취소요청 상세조회 훅 */
export const useCustomerOrderCancellationDetail = (
  cancelCode: string,
): UseQueryResult<OrderCancellationDetailRes, AxiosError> => {
  return useQuery(
    [CUSTOMER_ORDER_CANCEL_DETAIL_QUERY_KEY, cancelCode],
    () => getOrderCancellationDetail(cancelCode),
    {
      enabled: !!cancelCode,
    },
  );
};

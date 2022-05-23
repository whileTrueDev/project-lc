import {
  ExchangeDetailRes,
  ExchangeListRes,
  GetExchangeListDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import axios from '../../axios';

export const getExchangeList = async (
  dto: GetExchangeListDto,
): Promise<ExchangeListRes> => {
  return axios.get<ExchangeListRes>('/exchange', { params: dto }).then((res) => res.data);
};

/** 소비자 교환(재배송)내역 목록 조회 쿼리키 */
export const CUSTOMER_EXCHANGE_LIST_QUERY_KEY = 'InfiniteCustomerExchangeList';
/** 소비자 교환(재배송)내역 목록 조회 */
export const useCustomerInfiniteExchangeList = (
  dto: GetExchangeListDto,
): UseInfiniteQueryResult<ExchangeListRes, AxiosError> => {
  return useInfiniteQuery(
    [CUSTOMER_EXCHANGE_LIST_QUERY_KEY, dto.customerId],
    ({ pageParam = 0 }) => getExchangeList({ ...dto, skip: pageParam }),
    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
  );
};

export const getExchangeDetail = async (
  exchangeCode: string,
): Promise<ExchangeDetailRes> => {
  return axios
    .get<ExchangeDetailRes>(`/exchange/${exchangeCode}`)
    .then((res) => res.data);
};

/** 특정 교환(재배송) 상세조회 쿼리키 */
export const CUSTOMER_EXCHANGE_DETAIL_QUERY_KEY = 'customerExchangeDetail';
/** 특정 교환(재배송) 상세조회 훅 */
export const useExchangeDetail = (
  exchangeCode: string,
): UseQueryResult<ExchangeDetailRes, AxiosError> => {
  return useQuery(
    [CUSTOMER_EXCHANGE_DETAIL_QUERY_KEY, exchangeCode],
    () => getExchangeDetail(exchangeCode),
    { enabled: !!exchangeCode },
  );
};

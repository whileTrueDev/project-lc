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

/** 소비자 교환(재배송)내역 목록 조회 */
export const useCustomerInfiniteExchangeList = (
  dto: GetExchangeListDto,
): UseInfiniteQueryResult<ExchangeListRes, AxiosError> => {
  return useInfiniteQuery(
    ['InfiniteCustomerExchangeList', dto.customerId],
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

/** 특정 교환(재배송) 상세조회 훅 */
export const useExchangeDetail = (
  exchangeCode: string,
): UseQueryResult<ExchangeDetailRes, AxiosError> => {
  return useQuery(
    ['customerExchangeDetail', exchangeCode],
    () => getExchangeDetail(exchangeCode),
    { enabled: !!exchangeCode },
  );
};

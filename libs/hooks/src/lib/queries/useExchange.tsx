import { ExchangeListRes, GetExchangeListDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import axios from '../../axios';

export const getExchange = async (dto: GetExchangeListDto): Promise<ExchangeListRes> => {
  return axios.get<ExchangeListRes>('/exchange', { params: dto }).then((res) => res.data);
};

/** 소비자 교환(재배송)내역 목록 조회 */
export const useCustomerInfiniteExchangeList = (
  dto: GetExchangeListDto,
): UseInfiniteQueryResult<ExchangeListRes, AxiosError> => {
  return useInfiniteQuery(
    ['InfiniteCustomerExchangeList', dto.customerId],
    ({ pageParam = 0 }) => getExchange({ ...dto, skip: pageParam }),
    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
  );
};

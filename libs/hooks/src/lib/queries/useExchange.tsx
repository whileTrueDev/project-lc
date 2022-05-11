import { GetExchangeListDto, ExchangeListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getExchange = async (dto: GetExchangeListDto): Promise<ExchangeListRes> => {
  return axios.get<ExchangeListRes>('/exchange', { params: dto }).then((res) => res.data);
};

/** 소비자 교환(재배송)내역 목록 조회 */
export const useCustomerExchangeList = (
  dto: GetExchangeListDto,
): UseQueryResult<ExchangeListRes, AxiosError> => {
  return useQuery<ExchangeListRes, AxiosError>(
    ['customerExchangeList', dto.customerId],
    () => getExchange(dto),
    {
      enabled: !!dto.customerId,
    },
  );
};

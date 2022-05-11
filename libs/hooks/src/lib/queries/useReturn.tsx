import { GetReturnListDto, ReturnListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getReturn = async (dto: GetReturnListDto): Promise<ReturnListRes> => {
  return axios.get<ReturnListRes>('/return', { params: dto }).then((res) => res.data);
};

/** 소비자 반품목록 조회 */
export const useCustomerReturnList = (
  dto: GetReturnListDto,
): UseQueryResult<ReturnListRes, AxiosError> => {
  return useQuery<ReturnListRes, AxiosError>(
    ['customerReturnList', dto.customerId],
    () => getReturn(dto),
    {
      enabled: !!dto.customerId,
    },
  );
};

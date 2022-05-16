import { GetReturnListDto, ReturnListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import axios from '../../axios';

export const getReturn = async (dto: GetReturnListDto): Promise<ReturnListRes> => {
  return axios.get<ReturnListRes>('/return', { params: dto }).then((res) => res.data);
};

/** 소비자 반품목록 조회 */
export const useCustomerInfiniteReturnList = (
  dto: GetReturnListDto,
): UseInfiniteQueryResult<ReturnListRes, AxiosError> => {
  return useInfiniteQuery(
    ['InfiniteCustomerReturnList', dto.customerId],
    ({ pageParam = 0 }) => getReturn({ ...dto, skip: pageParam }),
    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
  );
};

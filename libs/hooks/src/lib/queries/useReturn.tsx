import {
  GetReturnListDto,
  ReturnDetailRes,
  ReturnListRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  UseQueryResult,
  useQuery,
} from 'react-query';
import axios from '../../axios';

export const getReturnList = async (dto: GetReturnListDto): Promise<ReturnListRes> => {
  return axios.get<ReturnListRes>('/return', { params: dto }).then((res) => res.data);
};

/** 소비자 반품목록 조회 쿼리키 */
export const CUSTOMER_RETURN_LIST_QUERY_KEY = 'InfiniteCustomerReturnList';
/** 소비자 반품목록 조회 */
export const useCustomerInfiniteReturnList = (
  dto: GetReturnListDto,
): UseInfiniteQueryResult<ReturnListRes, AxiosError> => {
  return useInfiniteQuery(
    [CUSTOMER_RETURN_LIST_QUERY_KEY, dto.customerId],
    ({ pageParam = 0 }) => getReturnList({ ...dto, skip: pageParam }),
    { getNextPageParam: (lastPage) => lastPage?.nextCursor },
  );
};

export const getReturnDetail = async (returnCode: string): Promise<ReturnDetailRes> => {
  return axios.get(`/return/${returnCode}`).then((res) => res.data);
};

/** 소비자 특정 반품요청 상세조회  쿼리키 */
export const CUSTOMER_RETURN_DETAIL_QUERY_KEY = 'customerReturnDetail';

/** 소비자 특정 반품요청 상세조회 */
export const useReturnDetail = (
  returnCode: string,
): UseQueryResult<ReturnDetailRes, AxiosError> => {
  return useQuery(
    [CUSTOMER_RETURN_DETAIL_QUERY_KEY, returnCode],
    () => getReturnDetail(returnCode),
    { enabled: !!returnCode },
  );
};

import { GetOrderListDto, OrderListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import axios from '../../axios';

export const getOrderList = async (dto: GetOrderListDto): Promise<OrderListRes> => {
  return axios
    .get<OrderListRes>('/order', {
      params: {
        search: dto.search,
        searchDateType: dto.searchDateType,
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        searchStatuses: dto.searchStatuses,
        sellerId: dto.sellerId,
        skip: dto.skip,
        take: dto.take,
      },
    })
    .then((res) => res.data);
};

/**  소비자센터 주문 목록 조회 infinited query */
export const INFINITE_ORDER_LIST_QUERY_KEY = 'InfiniteOrderList';
export const useInfiniteOrderList = (
  dto: GetOrderListDto,
): UseInfiniteQueryResult<OrderListRes, AxiosError> => {
  return useInfiniteQuery(
    INFINITE_ORDER_LIST_QUERY_KEY,
    ({ pageParam = 0 }) => getOrderList({ ...dto, skip: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor; // 이 값이 undefined 이면 hasNextPage = false가 됨
      },
    },
  );
};

/** 판매자센터 주문조회 */
export const useSellerOrderList = (
  dto: GetOrderListDto,
): UseQueryResult<OrderListRes, AxiosError> => {
  return useQuery<OrderListRes, AxiosError>(
    ['SellerOrderList', dto],
    () =>
      getOrderList({
        search: dto.search,
        searchDateType: dto.searchDateType,
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        searchStatuses: dto.searchStatuses,
        sellerId: dto.sellerId,
        skip: dto.skip,
        take: dto.take,
      }),
    {
      enabled: !!(
        dto.sellerId ||
        dto.search ||
        dto.periodStart ||
        dto.periodEnd ||
        dto.searchStatuses
      ),
    },
  );
};

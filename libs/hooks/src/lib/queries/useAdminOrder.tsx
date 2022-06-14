import { OrderListRes, OrderDetailRes, GetOrderListDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 관리자페이지에서 주문목록 조회(전체조회) */
export const getAdminOrderList = async (dto: GetOrderListDto): Promise<OrderListRes> => {
  return axios
    .get<OrderListRes>('/admin/order', {
      params: {
        search: dto.search,
        searchDateType: dto.searchDateType,
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        searchStatuses: dto.searchStatuses,
        skip: dto.skip,
        take: dto.take,
      },
    })
    .then((res) => res.data);
};

export const useAdminOrderList = (
  dto: GetOrderListDto,
): UseQueryResult<OrderListRes, AxiosError> => {
  return useQuery<OrderListRes, AxiosError>(
    ['AdminOrderList', dto],
    () =>
      getAdminOrderList({
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
      enabled: !!(dto.search || dto.periodStart || dto.periodEnd || dto.searchStatuses),
    },
  );
};

/** 관리자페이지에서 주문 세부사항 조회 */
export const getAdminOrder = async (orderId: number): Promise<OrderDetailRes> => {
  return axios.get<OrderDetailRes>(`/admin/order/${orderId}`).then((res) => res.data);
};

export const useAdminOrder = (
  orderId: number,
): UseQueryResult<OrderDetailRes, AxiosError> => {
  return useQuery<OrderDetailRes, AxiosError>(['getAdminOrder', orderId], () =>
    getAdminOrder(orderId),
  );
};

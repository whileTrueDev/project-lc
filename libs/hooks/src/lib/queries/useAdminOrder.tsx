import { OrderListRes, OrderDetailRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 관리자페이지에서 주문목록 조회(전체조회) */
export const getAdminOrderList = async (): Promise<OrderListRes> => {
  return axios.get<OrderListRes>('/admin/order').then((res) => res.data);
};

export const useAdminOrderList = (): UseQueryResult<OrderListRes, AxiosError> => {
  return useQuery<OrderListRes, AxiosError>('AdminOrderList', getAdminOrderList);
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

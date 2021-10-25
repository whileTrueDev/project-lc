import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 결제취소 요청 목록 조회 */
export type AdminOrderCancelRequestRes = any;

export const getAdminOrderCancelRequest =
  async (): Promise<AdminOrderCancelRequestRes> => {
    return axios
      .get<AdminOrderCancelRequestRes>('/admin/order-cancel/list')
      .then((res) => res.data);
  };

export const useAdminOrderCancelRequest = (): UseQueryResult<
  AdminOrderCancelRequestRes,
  AxiosError
> => {
  return useQuery<AdminOrderCancelRequestRes, AxiosError>(
    'AdminOrderCancelRequest',
    getAdminOrderCancelRequest,
  );
};

/** 특정 주문에 대한 결제취소 요청 조회 */
export type AdminOneOrderCancelRequestRes = any;

export const getAdminOneOrderCancelRequest = async (
  orderId: string,
): Promise<AdminOneOrderCancelRequestRes> => {
  return axios
    .get<AdminOneOrderCancelRequestRes>(`/admin/order-cancel/${orderId}`)
    .then((res) => res.data);
};

export const useAdminOneOrderCancelRequest = (
  orderId: string,
): UseQueryResult<AdminOneOrderCancelRequestRes, AxiosError> => {
  return useQuery<AdminOneOrderCancelRequestRes, AxiosError>(
    ['AdminOneOrderCancelRequest', orderId],
    () => getAdminOneOrderCancelRequest(orderId),
    { enabled: !!orderId },
  );
};

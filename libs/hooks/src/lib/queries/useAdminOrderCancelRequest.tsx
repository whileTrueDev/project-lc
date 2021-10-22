import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

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

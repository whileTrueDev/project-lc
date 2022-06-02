import { CustomerCouponLog } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminCouponHistory = async (): Promise<CustomerCouponLog[]> => {
  return axios.get<CustomerCouponLog[]>('/admin/coupon/history').then((res) => res.data);
};

export const useAdminCouponHistory = (): UseQueryResult<
  CustomerCouponLog[],
  AxiosError
> => {
  return useQuery<CustomerCouponLog[], AxiosError>(
    'AdminCouponHistory',
    getAdminCouponHistory,
  );
};

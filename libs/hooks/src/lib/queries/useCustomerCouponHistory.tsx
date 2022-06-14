import { CustomerCouponLog } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerCouponHistory = async (): Promise<CustomerCouponLog[]> => {
  return axios.get<CustomerCouponLog[]>('/coupon/history').then((res) => res.data);
};

export const useCustomerCouponHistory = (): UseQueryResult<
  CustomerCouponLog[],
  AxiosError
> => {
  return useQuery<CustomerCouponLog[], AxiosError>(
    'CustomerCouponHistory',
    getCustomerCouponHistory,
  );
};

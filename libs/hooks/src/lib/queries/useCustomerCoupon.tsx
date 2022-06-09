import { CustomerCoupon } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerCouponList = async (): Promise<CustomerCoupon[]> => {
  return axios.get<CustomerCoupon[]>('/coupon').then((res) => res.data);
};

export const useCustomerCouponList = (): UseQueryResult<CustomerCoupon[], AxiosError> => {
  return useQuery<CustomerCoupon[], AxiosError>(
    'CustomerCouponList',
    getCustomerCouponList,
  );
};

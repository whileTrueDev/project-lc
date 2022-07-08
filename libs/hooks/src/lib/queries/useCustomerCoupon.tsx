import { CustomerCouponRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerCouponList = async (): Promise<CustomerCouponRes[]> => {
  return axios.get<CustomerCouponRes[]>('/coupon').then((res) => res.data);
};

export const useCustomerCouponList = (): UseQueryResult<
  CustomerCouponRes[],
  AxiosError
> => {
  return useQuery<CustomerCouponRes[], AxiosError>(
    'CustomerCouponList',
    getCustomerCouponList,
  );
};

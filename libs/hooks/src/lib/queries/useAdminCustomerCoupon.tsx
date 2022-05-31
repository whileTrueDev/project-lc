import { CustomerCoupon } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

type CustomerCouponType = {
  customerId?: number;
  couponId?: number;
};

export const getAdminCustomerCoupon = async (
  dto: CustomerCouponType,
): Promise<CustomerCoupon[]> => {
  return axios
    .get<CustomerCoupon[]>('/admin/customer-coupon', {
      params: {
        customerId: dto.customerId,
        couponId: dto.couponId,
      },
    })
    .then((res) => res.data);
};

export const useAdminCustomerCoupon = (
  dto: CustomerCouponType,
): UseQueryResult<CustomerCoupon[], AxiosError> => {
  return useQuery<CustomerCoupon[], AxiosError>(
    'AdminCustomerCoupon',
    () => getAdminCustomerCoupon(dto),
    { enabled: !!dto.couponId || !!dto.customerId },
  );
};

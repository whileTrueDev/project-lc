import { Coupon } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminCouponList = async (): Promise<Coupon[]> => {
  return axios.get<Coupon[]>('/admin/coupon/list').then((res) => res.data);
};

export const useAdminCouponList = (): UseQueryResult<Coupon[], AxiosError> => {
  return useQuery<Coupon[], AxiosError>('AdminCouponList', getAdminCouponList);
};

export const getAdminCoupon = async (couponId: Coupon['id']): Promise<Coupon> => {
  return axios.get<Coupon>(`/admin/coupon/${couponId}`).then((res) => res.data);
};

export const useAdminCoupon = (
  couponId: Coupon['id'],
): UseQueryResult<Coupon, AxiosError> => {
  console.log(couponId);
  return useQuery<Coupon, AxiosError>('AdminCoupon', () => getAdminCoupon(couponId), {
    enabled: !!couponId,
  });
};

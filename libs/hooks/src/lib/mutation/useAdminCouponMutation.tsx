import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { Coupon } from '@prisma/client';
import { CouponDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useAdminCouponMutation = (): UseMutationResult<
  Coupon,
  AxiosError,
  CouponDto
> => {
  return useMutation<Coupon, AxiosError, CouponDto>((dto: CouponDto) =>
    axios.post<Coupon>('/admin/coupon', dto).then((res) => res.data),
  );
};

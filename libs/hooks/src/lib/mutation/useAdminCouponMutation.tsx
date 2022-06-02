import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Coupon } from '@prisma/client';
import { CouponDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useAdminCouponMutation = (): UseMutationResult<
  Coupon,
  AxiosError,
  CouponDto
> => {
  const queryClient = useQueryClient();

  return useMutation<Coupon, AxiosError, CouponDto>(
    (dto: CouponDto) => axios.post<Coupon>('/admin/coupon', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminCoupon', { refetchInactive: true });
      },
    },
  );
};

export const useAdminCouponDeleteMutation = (): UseMutationResult<
  Coupon,
  AxiosError,
  Coupon['id']
> => {
  const queryClient = useQueryClient();

  return useMutation<Coupon, AxiosError, Coupon['id']>(
    (id: Coupon['id']) =>
      axios.delete<Coupon>(`/admin/coupon/${id}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminCoupon', { refetchInactive: true });
      },
    },
  );
};

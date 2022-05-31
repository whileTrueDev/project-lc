import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CustomerCoupon } from '@prisma/client';
import { CustomerCouponDto } from '@project-lc/shared-types';
import axios from '../../axios';

type CustomerCouponWithoutCustomerIdAndCustomerId = Omit<
  CustomerCouponDto,
  'customerId' | 'couponId'
>;

export const useAdminCustomerCouponPatchMutation = (): UseMutationResult<
  CustomerCoupon,
  AxiosError,
  CustomerCouponWithoutCustomerIdAndCustomerId
> => {
  const queryClient = useQueryClient();
  return useMutation<
    CustomerCoupon,
    AxiosError,
    CustomerCouponWithoutCustomerIdAndCustomerId
  >(
    (dto: CustomerCouponWithoutCustomerIdAndCustomerId) =>
      axios
        .patch<CustomerCoupon>(`/admin/customer-coupon/${dto.id}`, dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminCustomerCoupon', { refetchInactive: true });
      },
    },
  );
};

export const useAdminCustomerCouponDeleteMutation = (): UseMutationResult<
  CustomerCoupon,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<CustomerCoupon, AxiosError, number>(
    (id: number) =>
      axios
        .delete<CustomerCoupon>(`/admin/customer-coupon/${id}`)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminCustomerCoupon', { refetchInactive: true });
      },
    },
  );
};

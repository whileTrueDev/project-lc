import { Order } from '@prisma/client';
import { UpdateOrderDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type OrderMutationDto = { orderId: Order['id']; dto: UpdateOrderDto };

/** 주문 update 훅 */
export const useOrderMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  OrderMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, OrderMutationDto>(
    ({ orderId, dto }: OrderMutationDto) =>
      axios.patch<boolean>(`/order/${orderId}`, dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('SellerOrderList', { refetchInactive: true });
      },
    },
  );
};

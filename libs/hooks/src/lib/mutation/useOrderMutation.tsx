import { Order } from '@prisma/client';
import {
  CreateOrderDto,
  CreateOrderShippingDto,
  UpdateOrderDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type OrderMutationDto = { orderId: Order['id']; dto: UpdateOrderDto };

/** 주문 update 훅 : 판매자가 요청하는 경우 sellerId를 dto에 포함해야한다 */
export const useOrderUpdateMutation = (): UseMutationResult<
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

export type OrderCreateDataType = {
  order: CreateOrderDto;
  shipping: CreateOrderShippingDto;
};

/** 주문 생성 훅 */
export const useOrderCreateMutation = (): UseMutationResult<
  Order,
  AxiosError,
  OrderCreateDataType
> => {
  const queryClient = useQueryClient();
  return useMutation<Order, AxiosError, OrderCreateDataType>(
    (dto: OrderCreateDataType) =>
      axios.post<Order>(`/order`, dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('Cart', { refetchInactive: true }); // 주문 생성 후 주문에 포함되었던 장바구니 상품 삭제함
      },
    },
  );
};

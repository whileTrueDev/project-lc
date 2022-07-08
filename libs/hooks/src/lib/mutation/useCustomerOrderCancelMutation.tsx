import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
  OrderCancellationListRes,
  OrderCancellationRemoveRes,
  OrderCancellationUpdateRes,
  OrderListRes,
  UpdateOrderCancellationStatusDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_CANCEL_LIST_QUERY_KEY } from '../queries/useOrderCancellation';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

export type useCustomerOrderCancelMutationDto = CreateOrderCancellationDto;

/** 소비자 주문취소 생성 뮤테이션 훅 */
export const useCustomerOrderCancelMutation = (
  options?: UseMutationOptions<
    CreateOrderCancellationRes,
    AxiosError,
    useCustomerOrderCancelMutationDto
  >,
): UseMutationResult<
  CreateOrderCancellationRes,
  AxiosError,
  useCustomerOrderCancelMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateOrderCancellationRes,
    AxiosError,
    useCustomerOrderCancelMutationDto
  >(
    (dto: useCustomerOrderCancelMutationDto) =>
      axios
        .post<CreateOrderCancellationRes>('order/cancellation', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries<OrderListRes>(INFINITE_ORDER_LIST_QUERY_KEY, {
          refetchInactive: true,
          refetchPage: (_lastPage, idx, pages) => {
            const targetPageIdx = pages.findIndex(
              (page) => page.orders.findIndex((order) => order.id === data.orderId) > -1,
            );
            return idx === targetPageIdx;
          },
        });
        queryClient.invalidateQueries<OrderCancellationListRes>(
          INFINITE_ORDER_CANCEL_LIST_QUERY_KEY,
          {
            refetchInactive: true,
            refetchPage: (_lastPage, idx, pages) => {
              const targetPageIdx = pages.findIndex(
                (page) => page.list.findIndex((cancel) => cancel.id === data.id) > -1,
              );
              return idx === targetPageIdx;
            },
          },
        );
      },
      ...options,
    },
  );
};

/** 주문취소 상태 업데이트 훅 */
export type OrderCancelMutationDto = {
  orderCancelId: number;
  dto: UpdateOrderCancellationStatusDto;
};
/** 크크쇼 db 반품 업데이트 훅 */
export const useUpdateOrderCancelMutation = (): UseMutationResult<
  OrderCancellationUpdateRes,
  AxiosError,
  OrderCancelMutationDto
> => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ orderCancelId, dto }: OrderCancelMutationDto) => {
      return axios.patch(`/order/cancellation/${orderCancelId}`, dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('customerOrderCancellationDetail');
      },
    },
  );
};

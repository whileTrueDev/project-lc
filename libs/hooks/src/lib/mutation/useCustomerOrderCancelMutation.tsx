import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
  OrderCancellationRemoveRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
  useQueryClient,
} from 'react-query';
import axios from '../../axios';
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
      onSuccess: () => queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY),
      ...options,
    },
  );
};

/** 소비자 주문취소 삭제 뮤테이션 훅 */
export const useDeleteCustomerOrderCancel = (): UseMutationResult<
  OrderCancellationRemoveRes,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation<OrderCancellationRemoveRes, AxiosError, number>(
    (orderCancellationId: number) =>
      axios
        .delete<OrderCancellationRemoveRes>(`order/cancellation/${orderCancellationId}`)
        .then((res) => res.data),
    {
      onSuccess: () => queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY),
    },
  );
};

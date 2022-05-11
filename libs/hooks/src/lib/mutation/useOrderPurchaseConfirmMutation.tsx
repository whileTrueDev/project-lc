import { AxiosError } from 'axios';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

export interface useOrderPurchaseConfirmMutationDto {
  orderItemOptionId: number;
}
export const useOrderPurchaseConfirmMutation = (
  options?: UseMutationOptions<boolean, AxiosError, useOrderPurchaseConfirmMutationDto>,
): UseMutationResult<boolean, AxiosError, useOrderPurchaseConfirmMutationDto> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, useOrderPurchaseConfirmMutationDto>(
    (dto: useOrderPurchaseConfirmMutationDto) =>
      axios.post<boolean>(`order/purchase-confirm`, dto).then((res) => res.data),
    {
      onSuccess: () => queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY),
      ...options,
    },
  );
};

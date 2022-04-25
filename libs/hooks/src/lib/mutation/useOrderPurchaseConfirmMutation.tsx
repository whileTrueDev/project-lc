import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

export interface useOrderPurchaseConfirmMutationDto {
  orderItemOptionId: number;
}
export const useOrderPurchaseConfirmMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  useOrderPurchaseConfirmMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, useOrderPurchaseConfirmMutationDto>(
    (dto: useOrderPurchaseConfirmMutationDto) =>
      axios.post<boolean>(`order/purchase-confirm`, dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        // TODO: infinite query invalidate 방법 찾아보기(구매확정 이후 업데이트 되어야함)
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
      },
    },
  );
};

import { AxiosError } from 'axios';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useOrderPurchaseConfirmMutationDto {
  orderItemOptionId: number;
}
export const useOrderPurchaseConfirmMutation = (
  options?: UseMutationOptions<boolean, AxiosError, useOrderPurchaseConfirmMutationDto>,
): UseMutationResult<boolean, AxiosError, useOrderPurchaseConfirmMutationDto> => {
  return useMutation<boolean, AxiosError, useOrderPurchaseConfirmMutationDto>(
    (dto: useOrderPurchaseConfirmMutationDto) =>
      axios.post<boolean>(`order/purchase-confirm`, dto).then((res) => res.data),
    options,
  );
};

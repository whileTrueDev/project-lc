import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { GoodsRejectionDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useGoodRejectionMutation = (): UseMutationResult<
  any,
  AxiosError,
  GoodsRejectionDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, GoodsRejectionDto>(
    (dto: GoodsRejectionDto) => {
      return axios.put<any>(`/admin/goods/reject`, dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('AdminGoodsList', { refetchInactive: true });
        queryClient.invalidateQueries('AdminLiveShoppingList', { refetchInactive: true });
        queryClient.invalidateQueries('AdminLiveShoppingGiftOrderList', {
          refetchInactive: true,
        });
      },
    },
  );
};

import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { GoodsConfirmationDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useGoodConfirmationMutation = (): UseMutationResult<
  any,
  AxiosError,
  GoodsConfirmationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, GoodsConfirmationDto>(
    (dto: GoodsConfirmationDto) => {
      return axios.put<any>(`/admin/goods/confirm`, dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('AdminGoodsList', { refetchInactive: true });
        queryClient.invalidateQueries('AdminLiveShoppingList', { refetchInactive: true });
        queryClient.invalidateQueries('AdminLiveShoppingGiftOrderList', {
          refetchInactive: true,
        });
        queryClient.invalidateQueries('AdminSidebarNotiCounts', {
          refetchInactive: true,
        });
      },
    },
  );
};

import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { LiveShoppingRegistDTO } from '@project-lc/shared-types';
import { LiveShopping } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useCreateLiveShoppingMutation = (): UseMutationResult<
  LiveShopping,
  AxiosError,
  LiveShoppingRegistDTO
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (dto: LiveShoppingRegistDTO) => {
      return axios.post<LiveShopping>('/live-shoppings', dto).then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('LiveShoppingList', { refetchInactive: true });
        queryClient.invalidateQueries('FmOrdersDuringLiveShoppingSales', {
          refetchInactive: true,
        });
      },
    },
  );
};

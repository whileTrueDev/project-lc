import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export const deleteLiveShopping = async (liveShoppingId: number): Promise<boolean> => {
  const { data } = await axios.delete<boolean>('/live-shoppings', {
    data: { liveShoppingId },
  });
  return data;
};

export const useDeleteLiveShopping = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation(deleteLiveShopping, {
    onSuccess: () => {
      queryClient.invalidateQueries('LiveShoppingList', { refetchInactive: true });
      queryClient.invalidateQueries('FmOrdersDuringLiveShoppingSales', {
        refetchInactive: true,
      });
    },
  });
};

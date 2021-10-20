import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export const deleteLiveShopping = async (liveShoppingId: number): Promise<boolean> => {
  const { data } = await axios.delete<boolean>('/live-shopping', {
    data: { liveShoppingId },
  });
  return data;
};

export const useDeleteLiveShopping = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  return useMutation(deleteLiveShopping);
};

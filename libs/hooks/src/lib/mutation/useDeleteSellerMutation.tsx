import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export const deleteSeller = async (email: string): Promise<boolean> => {
  const { data } = await axios.delete<boolean>('/seller', {
    data: { email },
  });
  return data;
};

export const useDeleteSellerMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  string
> => {
  return useMutation(deleteSeller);
};

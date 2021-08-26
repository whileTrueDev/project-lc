import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import axios from '../../axios';

export type useDeleteSellerMutationRes = AxiosResponse<boolean>;

export const deleteSeller = async (email: string) => {
  const { data } = await axios.delete<AxiosError, useDeleteSellerMutationRes>('/seller', {
    data: { email },
  });
  return data;
};

export const useDeleteSellerMutation = () => {
  return useMutation(deleteSeller);
};

import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Customer } from '.prisma/client';
import axios from '../../axios';

export const useCustomerDeleteMutation = (
  id: number,
): UseMutationResult<Customer, AxiosError, number> => {
  const queryClient = useQueryClient();
  return useMutation<Customer, AxiosError, number>(
    () => axios.delete<Customer>(`/customer/${id}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['CustomerInfo', id]);
      },
    },
  );
};

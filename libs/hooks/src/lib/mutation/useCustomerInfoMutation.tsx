import { UpdateCustomerDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Customer } from '.prisma/client';
import axios from '../../axios';

export const useCustomerInfoMutation = (
  id: number,
): UseMutationResult<Customer, AxiosError, UpdateCustomerDto> => {
  const queryClient = useQueryClient();
  return useMutation<Customer, AxiosError, UpdateCustomerDto>(
    (dto: UpdateCustomerDto) =>
      axios.patch<Customer>(`/customer/${id}`, dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['CustomerInfo', id], { refetchInactive: true });
      },
    },
  );
};

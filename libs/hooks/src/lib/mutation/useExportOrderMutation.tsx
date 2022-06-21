import { CreateKkshowExportDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useExportOrderMutationRes = boolean;

export const useExportOrderMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  CreateKkshowExportDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, CreateKkshowExportDto>(
    (dto: CreateKkshowExportDto) =>
      axios.post<boolean>('/export', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries('SellerOrderList');
          queryClient.invalidateQueries('OrderDetail');
          queryClient.invalidateQueries('Exports');
          queryClient.invalidateQueries(['Exports'], { refetchInactive: true });
        }
      },
    },
  );
};

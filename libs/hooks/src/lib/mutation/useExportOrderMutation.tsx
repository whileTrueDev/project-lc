import { CreateKkshowExportDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

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
          queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
          queryClient.invalidateQueries('SellerOrderList');
          queryClient.invalidateQueries('OrderDetail');
          queryClient.invalidateQueries('getAdminOrder');
          queryClient.invalidateQueries('Exports');
          queryClient.invalidateQueries(['Exports'], { refetchInactive: true });
        }
      },
    },
  );
};

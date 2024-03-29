import { ExportManyDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

export const useExportBundledOrdersMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  ExportManyDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, ExportManyDto>(
    (dto: ExportManyDto) =>
      axios.post<boolean>('/export/bundle', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
          queryClient.invalidateQueries('SellerOrderList');
          queryClient.invalidateQueries('OrderDetail');
          queryClient.invalidateQueries('getAdminOrder', { refetchInactive: true });
          queryClient.invalidateQueries('AdminOrderList');
        }
      },
    },
  );
};

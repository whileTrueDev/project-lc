import { ExportManyDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

export type useExportOrdersMutationRes = boolean;

export const useExportOrdersMutation = (): UseMutationResult<
  useExportOrdersMutationRes,
  AxiosError,
  ExportManyDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useExportOrdersMutationRes, AxiosError, ExportManyDto>(
    (dto: ExportManyDto) =>
      axios.post<useExportOrdersMutationRes>('/export/many', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
          queryClient.invalidateQueries('SellerOrderList');
          queryClient.invalidateQueries('OrderDetail');
          queryClient.invalidateQueries('getAdminOrder');
          queryClient.invalidateQueries('AdminOrderList');
        }
      },
    },
  );
};

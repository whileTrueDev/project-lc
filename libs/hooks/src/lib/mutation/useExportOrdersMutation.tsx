import { ExportOrdersDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useExportOrdersMutationRes = boolean;

export const useExportOrdersMutation = (): UseMutationResult<
  useExportOrdersMutationRes,
  AxiosError,
  ExportOrdersDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useExportOrdersMutationRes, AxiosError, ExportOrdersDto>(
    (dto: ExportOrdersDto) =>
      axios
        .post<useExportOrdersMutationRes>('/fm-exports/many', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries('FmOrder');
          queryClient.invalidateQueries(['FmOrders'], { refetchInactive: true });
        }
      },
    },
  );
};

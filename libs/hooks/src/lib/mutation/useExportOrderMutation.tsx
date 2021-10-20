import { ExportOrderDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useExportOrderMutationRes = boolean;

export const useExportOrderMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  ExportOrderDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, ExportOrderDto>(
    (dto: ExportOrderDto) =>
      axios.post<boolean>('/fm-exports', dto).then((res) => res.data),
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

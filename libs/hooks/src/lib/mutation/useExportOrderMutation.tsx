import { ExportOrderDto } from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
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
  const { search, searchDateType, searchStartDate, searchEndDate, searchStatuses } =
    useFmOrderStore();
  return useMutation<boolean, AxiosError, ExportOrderDto>(
    (dto: ExportOrderDto) =>
      axios.post<boolean>('/fm-exports', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries('FmOrder');
          queryClient.invalidateQueries(
            [
              'FmOrders',
              search,
              searchDateType,
              searchEndDate,
              searchStartDate,
              searchStatuses,
            ],
            { refetchInactive: true },
          );
        }
      },
    },
  );
};

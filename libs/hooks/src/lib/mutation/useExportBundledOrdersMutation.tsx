import { ExportBundledOrdersDto } from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export const useExportBundledOrdersMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  ExportBundledOrdersDto
> => {
  const queryClient = useQueryClient();
  const { search, searchDateType, searchStartDate, searchEndDate, searchStatuses } =
    useFmOrderStore();
  return useMutation<boolean, AxiosError, ExportBundledOrdersDto>(
    (dto: ExportBundledOrdersDto) =>
      axios.post<boolean>('/fm-exports/bundle', dto).then((res) => res.data),
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

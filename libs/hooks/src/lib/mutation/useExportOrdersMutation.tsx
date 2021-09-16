import { ExportOrdersDto } from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useExportOrdersMutationRes = boolean;

export const useExportOrdersMutation = () => {
  const queryClient = useQueryClient();
  const { search, searchDateType, searchStartDate, searchEndDate, searchStatuses } =
    useFmOrderStore();
  return useMutation(
    (dto: ExportOrdersDto) =>
      axios.post<useExportOrdersMutationRes>('/fm-exports/many', dto),
    {
      onSuccess: ({ data }) => {
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

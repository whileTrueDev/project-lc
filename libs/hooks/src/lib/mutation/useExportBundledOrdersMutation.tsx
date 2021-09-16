import { ExportBundledOrdersDto } from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useExportBundledOrdersMutationRes = boolean;

export const useExportBundledOrdersMutation = () => {
  const queryClient = useQueryClient();
  const { search, searchDateType, searchStartDate, searchEndDate, searchStatuses } =
    useFmOrderStore();
  return useMutation(
    (dto: ExportBundledOrdersDto) =>
      axios.post<useExportBundledOrdersMutationRes>('/fm-exports/bundle', dto),
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

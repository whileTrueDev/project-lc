import { ExportOrderDto } from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useExportOrderMutationRes = boolean;

export const useExportOrderMutation = () => {
  const queryClient = useQueryClient();
  const { search, searchDateType, searchStartDate, searchEndDate, searchStatuses } =
    useFmOrderStore();
  return useMutation(
    (dto: ExportOrderDto) => axios.post<useExportOrderMutationRes>('/fm-exports', dto),
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

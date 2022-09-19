import { CreateBcSettleHistoryWithExternalItemDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useCreateSettlementBcWithExternalItemDto =
  CreateBcSettleHistoryWithExternalItemDto;
export type useCreateSettlementBcWithExternalItemRes = boolean;

export const useCreateSettlementBcWithExternalItem = (): UseMutationResult<
  useCreateSettlementBcWithExternalItemRes,
  AxiosError,
  useCreateSettlementBcWithExternalItemDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCreateSettlementBcWithExternalItemRes,
    AxiosError,
    useCreateSettlementBcWithExternalItemDto
  >(
    (dto: useCreateSettlementBcWithExternalItemDto) =>
      axios
        .post<useCreateSettlementBcWithExternalItemRes>(
          '/admin/settlement/broadcaster/external-item',
          dto,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminBroadcasterSettlementHistories');
      },
    },
  );
};

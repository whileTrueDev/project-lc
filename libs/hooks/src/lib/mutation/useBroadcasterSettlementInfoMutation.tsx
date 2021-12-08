import { BroadcasterSettlementInfo } from '@prisma/client';
import { BroadcasterSettlementInfoDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

type ResType = BroadcasterSettlementInfo;

export const useBroadcasterSettlementInfoMutation = (): UseMutationResult<
  ResType,
  AxiosError,
  BroadcasterSettlementInfoDto
> => {
  const queryClient = useQueryClient();
  return useMutation<ResType, AxiosError, BroadcasterSettlementInfoDto>(
    (dto: BroadcasterSettlementInfoDto) =>
      axios.post<ResType>('/broadcaster/settlement', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('BroadcasterSettlementInfo');
      },
    },
  );
};

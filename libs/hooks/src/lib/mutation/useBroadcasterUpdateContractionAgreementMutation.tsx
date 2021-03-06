import { BroadcasterContractionAgreementDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Broadcaster } from '.prisma/client';
import axios from '../../axios';

export type useBroadcasterUpdateContractionAgreementMutationRes = Broadcaster;

export const useBroadcasterUpdateContractionAgreementMutation = (): UseMutationResult<
  useBroadcasterUpdateContractionAgreementMutationRes,
  AxiosError,
  BroadcasterContractionAgreementDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useBroadcasterUpdateContractionAgreementMutationRes,
    AxiosError,
    BroadcasterContractionAgreementDto
  >(
    (dto: BroadcasterContractionAgreementDto) =>
      axios
        .patch<useBroadcasterUpdateContractionAgreementMutationRes>(
          '/broadcaster/agreement',
          dto,
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Profile');
      },
    },
  );
};

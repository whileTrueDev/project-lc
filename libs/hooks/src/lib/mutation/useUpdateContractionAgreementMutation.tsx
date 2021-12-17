import { BroadcasterContractionAgreementDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Broadcaster } from '.prisma/client';
import axios from '../../axios';

export type useUpdateContractionAgreementMutationRes = Broadcaster;

export const useUpdateContractionAgreementMutation = (): UseMutationResult<
  useUpdateContractionAgreementMutationRes,
  AxiosError,
  BroadcasterContractionAgreementDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useUpdateContractionAgreementMutationRes,
    AxiosError,
    BroadcasterContractionAgreementDto
  >(
    (dto: BroadcasterContractionAgreementDto) =>
      axios
        .patch<useUpdateContractionAgreementMutationRes>('/broadcaster/agreement', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Profile');
      },
    },
  );
};

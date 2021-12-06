import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import { BroadcasterAddressDto } from '@project-lc/shared-types';
import { BroadcasterAddress } from '.prisma/client';
import axios from '../../axios';

export type useBroadcasterAddressMutationRes = BroadcasterAddress;

export const useBroadcasterAddressMutation = (): UseMutationResult<
  useBroadcasterAddressMutationRes,
  AxiosError,
  BroadcasterAddressDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useBroadcasterAddressMutationRes, AxiosError, BroadcasterAddressDto>(
    (dto: BroadcasterAddressDto) =>
      axios
        .put<useBroadcasterAddressMutationRes>('/broadcaster/address', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('Broadcaster');
      },
    },
  );
};

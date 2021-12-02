import { BroadcasterChannel } from '@prisma/client';
import { CreateBroadcasterChannelDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

/** 방송인 채널 생성 뮤테이션 */
export const useBroadcasterChannelCreateMutation = (): UseMutationResult<
  BroadcasterChannel,
  AxiosError,
  CreateBroadcasterChannelDto
> => {
  const queryClient = useQueryClient();
  return useMutation<BroadcasterChannel, AxiosError, CreateBroadcasterChannelDto>(
    (dto: CreateBroadcasterChannelDto) =>
      axios.post<BroadcasterChannel>('/broadcaster/channel', dto).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('BroadcasterChannels');
      },
    },
  );
};

/** 방송인 채널 삭제 뮤테이션 */
export const useBroadcasterChannelDeleteMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, number>(
    (channelId: number) =>
      axios.delete<boolean>(`/broadcaster/${channelId}`).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('BroadcasterChannels');
      },
    },
  );
};

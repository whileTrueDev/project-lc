import { LiveShoppingStateBoardMessage } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type LiveShoppingStateBoardAdminMessage = LiveShoppingStateBoardMessage | null;

export const getLiveShoppingStateBoardAdminMessage = async ({
  liveShoppingId,
}: {
  liveShoppingId: number;
}): Promise<LiveShoppingStateBoardAdminMessage> => {
  return axios
    .get<LiveShoppingStateBoardAdminMessage>(
      '/live-shoppings/current-state-admin-message',
      { params: { liveShoppingId } },
    )
    .then((res) => res.data);
};

export const useLiveShoppingStateBoardAdminMessage = ({
  liveShoppingId,
  refetchInterval,
}: {
  liveShoppingId: number;
  refetchInterval?: number;
}): UseQueryResult<LiveShoppingStateBoardAdminMessage, AxiosError> => {
  return useQuery<LiveShoppingStateBoardAdminMessage, AxiosError>(
    ['LiveShoppingStateBoardAdminMessage', liveShoppingId],
    () => getLiveShoppingStateBoardAdminMessage({ liveShoppingId }),
    { enabled: !!liveShoppingId, refetchInterval },
  );
};

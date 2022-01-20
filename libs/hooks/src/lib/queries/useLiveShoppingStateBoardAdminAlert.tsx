import { LiveShoppingStateBoardAlert } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type LiveShoppingStateBoardAdminAlert = LiveShoppingStateBoardAlert | null;

export const getLiveShoppingStateBoardAdminAlert = async ({
  liveShoppingId,
}: {
  liveShoppingId: number;
}): Promise<LiveShoppingStateBoardAdminAlert> => {
  return axios
    .get<LiveShoppingStateBoardAdminAlert>('/live-shoppings/current-state-admin-alert', {
      params: { liveShoppingId },
    })
    .then((res) => res.data);
};

export const useLiveShoppingStateBoardAdminAlert = ({
  liveShoppingId,
  refetchInterval,
}: {
  liveShoppingId: number;
  refetchInterval?: number;
}): UseQueryResult<LiveShoppingStateBoardAdminAlert, AxiosError> => {
  return useQuery<LiveShoppingStateBoardAdminAlert, AxiosError>(
    ['LiveShoppingStateBoardAdminAlert', liveShoppingId],
    () => getLiveShoppingStateBoardAdminAlert({ liveShoppingId }),
    { enabled: !!liveShoppingId, refetchInterval },
  );
};

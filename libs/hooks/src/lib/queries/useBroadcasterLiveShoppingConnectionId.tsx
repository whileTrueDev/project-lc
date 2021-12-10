import { BroadcasterRes, FindBroadcasterDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterLiveShoppingConnectionId = async (
  broadcasterId: number,
): Promise<any | null> => {
  return axios
    .get<any | null>('/live-shoppings/broadcaster/fm-connection-id', {
      params: broadcasterId,
    })
    .then((res) => res.data);
};

export const useBroadcasterLiveShoppingConnectionId = (
  broadcasterId: number,
): UseQueryResult<any | null, AxiosError> => {
  return useQuery<any | null, AxiosError>(
    ['BroadcasterLiveShoppingConnectionId', broadcasterId],
    () => getBroadcasterLiveShoppingConnectionId(broadcasterId),
    { enabled: !!broadcasterId },
  );
};

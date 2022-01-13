import { useQuery, UseQueryResult } from 'react-query';
import { LiveShopping } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getBroadcasterFmOrdersDuringLiveShoppingSales = async (
  broadcasterId: number | undefined,
): Promise<LiveShopping[]> => {
  return axios
    .get<LiveShopping[]>('/fm-orders/broadcaster/per-live-shopping', {
      params: { broadcasterId },
    })
    .then((res) => res.data);
};

export const useBroadcasterFmOrdersDuringLiveShoppingSales = ({
  broadcasterId,
}: {
  broadcasterId: number | undefined;
}): UseQueryResult<LiveShopping[], AxiosError> => {
  return useQuery<LiveShopping[], AxiosError>(
    'broadCasterFmOrdersDuringLiveShoppingSales',
    () => getBroadcasterFmOrdersDuringLiveShoppingSales(broadcasterId),
    { enabled: !!broadcasterId },
  );
};

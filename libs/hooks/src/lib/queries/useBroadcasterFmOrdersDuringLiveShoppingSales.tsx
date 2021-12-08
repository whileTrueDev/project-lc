import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { LiveShoppingWithSalesAndFmId } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getBroadcasterFmOrdersDuringLiveShoppingSales = async (
  broadcasterId: number | undefined,
): Promise<LiveShoppingWithSalesAndFmId[]> => {
  return axios
    .get<LiveShoppingWithSalesAndFmId[]>('/fm-orders/broadcaster/per-live-shopping', {
      params: { broadcasterId },
    })
    .then((res) => res.data);
};

export const useBroadcasterFmOrdersDuringLiveShoppingSales = ({
  broadcasterId,
  enabled,
}: {
  broadcasterId: number;
  enabled: boolean;
}): UseQueryResult<LiveShoppingWithSalesAndFmId[], AxiosError> => {
  return useQuery<LiveShoppingWithSalesAndFmId[], AxiosError>(
    'broadCasterFmOrdersDuringLiveShoppingSales',
    () => getBroadcasterFmOrdersDuringLiveShoppingSales(broadcasterId),
    { retry: 1, enabled },
  );
};

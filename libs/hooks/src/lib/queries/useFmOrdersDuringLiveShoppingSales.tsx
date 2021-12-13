import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { LiveShoppingWithSalesAndFmId } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrdersDuringLiveShoppingSales = async (): Promise<
  LiveShoppingWithSalesAndFmId[]
> => {
  return axios
    .get<LiveShoppingWithSalesAndFmId[]>('/fm-orders/per-live-shopping')
    .then((res) => res.data);
};

export const useFmOrdersDuringLiveShoppingSales = (
  options?: UseQueryOptions<LiveShoppingWithSalesAndFmId[], AxiosError>,
): UseQueryResult<LiveShoppingWithSalesAndFmId[], AxiosError> => {
  return useQuery<LiveShoppingWithSalesAndFmId[], AxiosError>(
    'FmOrdersDuringLiveShoppingSales',
    getFmOrdersDuringLiveShoppingSales,
    options,
  );
};

export const getFmOrdersDuringLiveShoppingSalesPurchaseDone = async (
  broadcasterId: number | undefined,
): Promise<LiveShoppingWithSalesAndFmId[]> => {
  return axios
    .get<LiveShoppingWithSalesAndFmId[]>('/fm-orders/broadcaster/purchases', {
      params: { broadcasterId },
    })
    .then((res) => res.data);
};

export const useFmOrdersDuringLiveShoppingSalesPurchaseDone = (
  broadcasterId: number | undefined,
): UseQueryResult<LiveShoppingWithSalesAndFmId[], AxiosError> => {
  return useQuery<LiveShoppingWithSalesAndFmId[], AxiosError>(
    'getFmOrdersDuringLiveShoppingSalesPurchaseDone',
    () => getFmOrdersDuringLiveShoppingSalesPurchaseDone(broadcasterId),
    { enabled: !!broadcasterId },
  );
};

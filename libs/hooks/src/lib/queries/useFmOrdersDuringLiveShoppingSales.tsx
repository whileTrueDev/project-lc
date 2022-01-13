import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { LiveShopping } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrdersDuringLiveShoppingSales = async (): Promise<LiveShopping[]> => {
  return axios
    .get<LiveShopping[]>('/fm-orders/per-live-shopping')
    .then((res) => res.data);
};

export const useFmOrdersDuringLiveShoppingSales = (
  options?: UseQueryOptions<LiveShopping[], AxiosError>,
): UseQueryResult<LiveShopping[], AxiosError> => {
  return useQuery<LiveShopping[], AxiosError>(
    'FmOrdersDuringLiveShoppingSales',
    getFmOrdersDuringLiveShoppingSales,
    options,
  );
};

export const getFmOrdersDuringLiveShoppingSalesPurchaseDone = async (
  broadcasterId: number | undefined,
): Promise<LiveShopping[]> => {
  return axios
    .get<LiveShopping[]>('/fm-orders/broadcaster/purchases', {
      params: { broadcasterId },
    })
    .then((res) => res.data);
};

export const useFmOrdersDuringLiveShoppingSalesPurchaseDone = (
  broadcasterId: number | undefined,
): UseQueryResult<LiveShopping[], AxiosError> => {
  return useQuery<LiveShopping[], AxiosError>(
    'getFmOrdersDuringLiveShoppingSalesPurchaseDone',
    () => getFmOrdersDuringLiveShoppingSalesPurchaseDone(broadcasterId),
    { enabled: !!broadcasterId },
  );
};

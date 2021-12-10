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
  firstmallGoodsConnectionId: { firstmallGoodsConnectionId: number }[],
): Promise<LiveShoppingWithSalesAndFmId[]> => {
  return axios
    .get<LiveShoppingWithSalesAndFmId[]>('/fm-orders/broadcaster/purchases', {
      params: { firstmallGoodsConnectionId },
    })
    .then((res) => res.data);
};

export const useFmOrdersDuringLiveShoppingSalesPurchaseDone = (
  firstmallGoodsConnectionId: { firstmallGoodsConnectionId: number }[],
  options?: UseQueryOptions<LiveShoppingWithSalesAndFmId[], AxiosError>,
): UseQueryResult<LiveShoppingWithSalesAndFmId[], AxiosError> => {
  return useQuery<LiveShoppingWithSalesAndFmId[], AxiosError>(
    'getFmOrdersDuringLiveShoppingSalesPurchaseDone',
    () => getFmOrdersDuringLiveShoppingSalesPurchaseDone(firstmallGoodsConnectionId),
    options,
  );
};

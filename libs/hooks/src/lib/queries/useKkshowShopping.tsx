import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const kkshowShoppingQueryKey = 'KkshowShopping';
export const getKkshowShopping = async (): Promise<KkshowShoppingTabResData> => {
  const url =
    process.env.NEXT_PUBLIC_APP_TYPE === 'admin'
      ? '/admin/kkshow-shopping'
      : 'kkshow-shopping';
  return axios.get<KkshowShoppingTabResData>(url).then((res) => res.data);
};

export const useKkshowShopping = (): UseQueryResult<
  KkshowShoppingTabResData,
  AxiosError
> => {
  return useQuery<KkshowShoppingTabResData, AxiosError>(
    kkshowShoppingQueryKey,
    getKkshowShopping,
  );
};

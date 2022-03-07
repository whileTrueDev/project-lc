import { KkshowMain } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getKkshowMain = async (): Promise<KkshowMain> => {
  const url =
    process.env.NEXT_PUBLIC_APP_TYPE === 'admin' ? '/admin/kkshow-main' : 'kkshow-main';
  return axios.get<KkshowMain>(url).then((res) => res.data);
};

export const useKkshowMain = (): UseQueryResult<KkshowMain, AxiosError> => {
  return useQuery<KkshowMain, AxiosError>('KkshowMain', getKkshowMain);
};

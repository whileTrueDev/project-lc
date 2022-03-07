import { KkshowMainResData } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getKkshowMain = async (): Promise<KkshowMainResData> => {
  const url =
    process.env.NEXT_PUBLIC_APP_TYPE === 'admin' ? '/admin/kkshow-main' : 'kkshow-main';
  return axios.get<KkshowMainResData>(url).then((res) => res.data);
};

export const useKkshowMain = (): UseQueryResult<KkshowMainResData, AxiosError> => {
  return useQuery<KkshowMainResData, AxiosError>('KkshowMain', getKkshowMain);
};

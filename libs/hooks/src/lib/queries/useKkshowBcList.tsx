import { KkshowBcList } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const kkshowBcListQueryKey = 'KkshowBcList';
export const getKkshowBcList = async (): Promise<KkshowBcList[]> => {
  const url =
    process.env.NEXT_PUBLIC_APP_TYPE === 'admin'
      ? '/admin/kkshow-bc-list'
      : 'kkshow-bc-list';
  return axios.get<KkshowBcList[]>(url).then((res) => res.data);
};

export const useKkshowBcList = (): UseQueryResult<KkshowBcList[], AxiosError> => {
  return useQuery<KkshowBcList[], AxiosError>(kkshowBcListQueryKey, getKkshowBcList);
};

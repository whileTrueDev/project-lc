import { LatestCheckedDataRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminLatestCheckedData = async (): Promise<LatestCheckedDataRes> => {
  return axios
    .get<LatestCheckedDataRes>('/admin/tab-alarm/checkedData')
    .then((res) => res.data);
};

export const useAdminLatestCheckedData = (): UseQueryResult<
  LatestCheckedDataRes,
  AxiosError
> => {
  return useQuery<LatestCheckedDataRes, AxiosError>(
    'AdminLatestCheckedData',
    getAdminLatestCheckedData,
  );
};

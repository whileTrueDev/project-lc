import { LastCheckedDataRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminLastCheckedData = async (): Promise<LastCheckedDataRes> => {
  return axios
    .get<LastCheckedDataRes>('/admin/tab-alarm/checkedData')
    .then((res) => res.data);
};

export const useAdminLastCheckedData = (): UseQueryResult<
  LastCheckedDataRes,
  AxiosError
> => {
  return useQuery<LastCheckedDataRes, AxiosError>(
    'AdminLastCheckedData',
    getAdminLastCheckedData,
  );
};

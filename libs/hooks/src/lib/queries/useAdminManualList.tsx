import { AdminManualListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const ADMIN_MANUAL_QUERY_KEY = 'AdminManualList';

export const getAdminManualList = async (): Promise<AdminManualListRes> => {
  return axios.get<AdminManualListRes>('/admin/manual/list').then((res) => res.data);
};

export const useAdminManualList = (): UseQueryResult<AdminManualListRes, AxiosError> => {
  return useQuery<AdminManualListRes, AxiosError>(
    ADMIN_MANUAL_QUERY_KEY,
    getAdminManualList,
  );
};

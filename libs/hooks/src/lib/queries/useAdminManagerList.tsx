import { useQuery, UseQueryResult } from 'react-query';
import { AdminClassDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getAdminManagerList = async (): Promise<AdminClassDto[]> => {
  return axios.get<AdminClassDto[]>('/admin/admin-managers').then((res) => res.data);
};

export const useAdminManagerList = (): UseQueryResult<AdminClassDto[], AxiosError> => {
  return useQuery<AdminClassDto[], AxiosError>(
    ['getAdminManagerList'],
    getAdminManagerList,
  );
};

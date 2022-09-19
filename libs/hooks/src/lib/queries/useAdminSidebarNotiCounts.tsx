import { AdminNotiCountRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminSidebarNotiCounts = AdminNotiCountRes;

export const getAdminSidebarNotiCounts = async (): Promise<AdminSidebarNotiCounts> => {
  return axios
    .get<AdminSidebarNotiCounts>('/admin/tab-alarm/sidebar-noti-counts')
    .then((res) => res.data);
};

export const useAdminSidebarNotiCounts = (): UseQueryResult<
  AdminSidebarNotiCounts,
  AxiosError
> => {
  return useQuery<AdminSidebarNotiCounts, AxiosError>(
    'AdminSidebarNotiCounts',
    getAdminSidebarNotiCounts,
  );
};

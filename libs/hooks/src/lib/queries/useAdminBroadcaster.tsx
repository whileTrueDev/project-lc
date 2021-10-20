import { useQuery, UseQueryResult } from 'react-query';
import { BroadcasterDTO } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getAdminBroadcaster = async (): Promise<BroadcasterDTO[]> => {
  return axios
    .get<BroadcasterDTO[]>(`/admin/live-shopping/broadcasters`)
    .then((res) => res.data);
};

export const useAdminBroadcaster = (): UseQueryResult<BroadcasterDTO[], AxiosError> => {
  return useQuery<BroadcasterDTO[], AxiosError>(['getBroadcaster'], getAdminBroadcaster);
};

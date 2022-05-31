import { useQuery, UseQueryResult } from 'react-query';
import { BroadcasterDTO } from '@project-lc/shared-types';
import { Broadcaster } from '@prisma/client';
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

export const getAdminBroadcasters = (): Promise<Broadcaster[]> => {
  return axios.get<Broadcaster[]>(`/admin/broadcasters`).then((res) => res.data);
};

export const useAdminBroadcasters = (): UseQueryResult<Broadcaster[], AxiosError> => {
  return useQuery<Broadcaster[], AxiosError>(['getBroadcasters'], getAdminBroadcasters);
};

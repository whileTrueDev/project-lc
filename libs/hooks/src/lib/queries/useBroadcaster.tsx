import { useQuery, UseQueryResult } from 'react-query';
import { BroadcasterDTO } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getBroadcaster = async (): Promise<BroadcasterDTO[]> => {
  return axios
    .get<BroadcasterDTO[]>(`/admin/live-shopping/broadcaster`)
    .then((res) => res.data);
};

export const useBroadcaster = (): UseQueryResult<BroadcasterDTO[], AxiosError> => {
  return useQuery<BroadcasterDTO[], AxiosError>(['getBroadcaster'], getBroadcaster);
};

import { useQuery, UseQueryResult } from 'react-query';
import { FindFmOrderDetailRes, FmOrder } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getBroadcaster = async (): Promise<any> => {
  return axios.get<any>(`/admin/live-shopping/broadcaster`).then((res) => res.data);
};

export const useBroadcaster = (): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(['getBroadcaster'], getBroadcaster);
};

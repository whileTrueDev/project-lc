import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type HealthCheck = string;

export const getHealthCheck = async (): Promise<HealthCheck> => {
  return axios.get<HealthCheck>('/').then((res) => res.data);
};

export const useHealthCheck = (): UseQueryResult<HealthCheck, AxiosError> => {
  return useQuery<HealthCheck, AxiosError>('HealthCheck', getHealthCheck);
};

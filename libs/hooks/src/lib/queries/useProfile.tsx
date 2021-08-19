import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export const getProfile = async (): Promise<any> => {
  return axios.get<any>('/auth/profile').then((res) => res.data);
};

export const useProfile = (options?: UseQueryOptions<any, AxiosError>) => {
  return useQuery<any, AxiosError>('Profile', getProfile, {
    retry: false,
    ...options,
  });
};

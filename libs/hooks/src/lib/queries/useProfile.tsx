import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export const getProfile = async (): Promise<any> => {
  return axios.get<any>('/auth/profile').then((res) => res.data);
};

export const useProfile = (options?: UseQueryOptions) => {
  return useQuery<any>('Profile', getProfile, {
    retry: false,
    ...options,
  });
};

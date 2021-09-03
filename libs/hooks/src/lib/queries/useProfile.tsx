import { UserProfileRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export type useProfileRes = UserProfileRes;

export const getProfile = async (): Promise<useProfileRes> => {
  return axios.get<useProfileRes>('/auth/profile').then((res) => res.data);
};

export const useProfile = (options?: UseQueryOptions<useProfileRes, AxiosError>) => {
  return useQuery<useProfileRes, AxiosError>('Profile', getProfile, {
    retry: false,
    ...options,
  });
};

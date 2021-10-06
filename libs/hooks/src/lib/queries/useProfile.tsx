import { UserProfileRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getProfile = async (): Promise<UserProfileRes> => {
  return axios.get<UserProfileRes>('/auth/profile').then((res) => res.data);
};

export const useProfile = (
  options?: UseQueryOptions<UserProfileRes, AxiosError>,
): UseQueryResult<UserProfileRes, AxiosError> => {
  return useQuery<UserProfileRes, AxiosError>('Profile', getProfile, {
    retry: false,
    ...options,
  });
};

import { UserProfileRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

type ProfileRes = UserProfileRes | null;
export const getProfile = async (): Promise<ProfileRes> => {
  return axios
    .get<ProfileRes>('/auth/profile', {
      params: { appType: process.env.NEXT_PUBLIC_APP_TYPE },
    })
    .then((res) => res.data);
};

export const useProfile = (
  options?: UseQueryOptions<ProfileRes, AxiosError>,
): UseQueryResult<ProfileRes, AxiosError> => {
  return useQuery<ProfileRes, AxiosError>('Profile', getProfile, {
    retry: false,
    ...options,
  });
};

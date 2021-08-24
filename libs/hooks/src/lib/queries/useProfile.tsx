import { Seller } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export type useProfileRes = Omit<Seller, 'pasword'> & {
  hasPassword: boolean; // 비밀번호 null 인지 여부
};

export const getProfile = async (): Promise<useProfileRes> => {
  return axios.get<useProfileRes>('/auth/profile').then((res) => res.data);
};

export const useProfile = (options?: UseQueryOptions<useProfileRes, AxiosError>) => {
  return useQuery<useProfileRes, AxiosError>('Profile', getProfile, {
    retry: false,
    ...options,
  });
};

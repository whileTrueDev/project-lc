import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export type SocialProvider = 'google' | 'kakao' | 'naver';
export interface SocialLogin {
  provider: SocialProvider;
}

export const getSocialLogin = async (provider: SocialProvider): Promise<any> => {
  return axios.get<any>(`/auth/social/${provider}/login`).then((res) => res.data);
};

export const useSocialLogin = (
  provider: SocialProvider,
  options?: UseQueryOptions<any>,
) => {
  return useQuery<any>(['SocialLogin', provider], () => getSocialLogin(provider), {
    ...options,
  });
};

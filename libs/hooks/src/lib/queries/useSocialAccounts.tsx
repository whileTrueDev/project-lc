import { UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type SocialAccount = {
  provider: string;
  registDate: Date;
  serviceId: string;
  name: string;
};

export type SocialAccounts = SocialAccount[];

export const getSocialAccounts = async (
  userType: UserType,
  email: string,
): Promise<SocialAccounts> => {
  return axios
    .get<SocialAccounts>('/social/accounts', { params: { email, userType } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const useSocialAccounts = (
  userType: UserType,
  email: string,
): UseQueryResult<SocialAccounts, AxiosError> => {
  return useQuery<SocialAccounts, AxiosError>(
    ['SocialAccounts', email, userType],
    () => getSocialAccounts(userType, email),
    {
      enabled: !!email,
    },
  );
};

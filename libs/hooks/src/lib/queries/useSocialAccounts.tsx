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

export const getSocialAccounts = async (email: string): Promise<SocialAccounts> => {
  return axios
    .get<SocialAccounts>('/social/accounts', { params: { email } })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const useSocialAccounts = (
  email: string,
): UseQueryResult<SocialAccounts, AxiosError> => {
  return useQuery<SocialAccounts, AxiosError>(
    ['SocialAccounts', email],
    () => getSocialAccounts(email),
    {
      enabled: !!email,
    },
  );
};

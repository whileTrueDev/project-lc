import { UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getEmailDupCheck = async (
  email: string,
  userType: UserType = 'seller',
): Promise<boolean> => {
  return axios
    .get<boolean>(`/${userType}/email-check`, {
      params: { email },
    })
    .then((res) => res.data);
};

export const useEmailDupCheck = (
  initialData: boolean,
  email: string,
): UseQueryResult<boolean, AxiosError> => {
  return useQuery<boolean, AxiosError>(
    ['EmailDupCheck', email],
    () => getEmailDupCheck(email),
    {
      initialData,
    },
  );
};

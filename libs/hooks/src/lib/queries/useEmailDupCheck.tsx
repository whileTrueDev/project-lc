import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getEmailDupCheck = async (email: string): Promise<boolean> => {
  const userType = process.env.NEXT_PUBLIC_APP_TYPE;
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

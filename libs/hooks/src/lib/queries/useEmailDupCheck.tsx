import { useQuery } from 'react-query';
import axios from '../../axios';

export const getEmailDupCheck = async (email: string): Promise<boolean> => {
  return axios
    .get<boolean>('/seller/email-check', {
      params: { email },
    })
    .then((res) => res.data);
};

export const useEmailDupCheck = (initialData: boolean, email: string) => {
  return useQuery<boolean>(['EmailDupCheck', email], () => getEmailDupCheck(email), {
    initialData,
  });
};

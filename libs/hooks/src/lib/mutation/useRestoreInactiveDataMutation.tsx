import { useMutation, UseMutationResult } from 'react-query';
import { Broadcaster } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useRestoreInactiveDataMutation = (): UseMutationResult<
  Broadcaster,
  AxiosError,
  string
> => {
  const userType = process.env.NEXT_PUBLIC_APP_TYPE;

  return useMutation(async (email: string) => {
    return axios.patch(`/${userType}/restore`, { email }).then((res) => res.data);
  });
};

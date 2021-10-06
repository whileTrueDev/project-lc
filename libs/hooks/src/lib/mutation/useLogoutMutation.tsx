import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export const useLogoutMutation = (): UseMutationResult<string, AxiosError, void> => {
  const router = useRouter();
  return useMutation<string, AxiosError, void>(
    async () => {
      const { data } = await axios.post('/auth/logout');
      return data;
    },
    {
      onSuccess: () => {
        router.push('/');
      },
    },
  );
};

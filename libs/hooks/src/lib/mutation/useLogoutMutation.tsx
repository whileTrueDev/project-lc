import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from '../../axios';

export const useLogoutMutation = () => {
  const router = useRouter();
  return useMutation(
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

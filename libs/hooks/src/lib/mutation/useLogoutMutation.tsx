import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from '../../axios';

export const useLogoutMutation = () => {
  const router = useRouter();
  return useMutation(() => axios.post('/auth/logout'), {
    onSuccess: () => {
      router.push('/');
    },
  });
};

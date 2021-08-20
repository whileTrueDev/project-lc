import { useMutation } from 'react-query';
import axios from '../../axios';

export const useLogoutMutation = () => {
  return useMutation(() => axios.post('/auth/logout'));
};

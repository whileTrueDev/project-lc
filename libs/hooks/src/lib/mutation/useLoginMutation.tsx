import { useMutation } from 'react-query';
import { LoginSellerDto } from '@project-lc/shared-types';
import axios from '../../axios';

export type useLoginMutationRes = any;

export const useLoginMutation = () => {
  return useMutation((dto: LoginSellerDto) =>
    axios.post<useLoginMutationRes>('/auth/login', dto),
  );
};

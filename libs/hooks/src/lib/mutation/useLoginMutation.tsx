import { useMutation } from 'react-query';
import { LoginSellerDto, loginUserRes } from '@project-lc/shared-types';
import axios from '../../axios';

export const useLoginMutation = (type: 'seller' | 'creator') => {
  return useMutation((dto: LoginSellerDto) =>
    axios.post<loginUserRes>('/auth/login', dto, {
      params: {
        type,
      },
    }),
  );
};

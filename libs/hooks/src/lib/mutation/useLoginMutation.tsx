import { useMutation } from 'react-query';
import { LoginSellerDto, loginUserRes, UserType } from '@project-lc/shared-types';
import axios from '../../axios';

export const useLoginMutation = (type: UserType) => {
  return useMutation((dto: LoginSellerDto) =>
    axios.post<loginUserRes>('/auth/login', dto, {
      params: {
        type,
      },
    }),
  );
};

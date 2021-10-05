import { useMutation, UseMutationResult } from 'react-query';
import { LoginSellerDto, loginUserRes, UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useLoginMutation = (
  type: UserType,
): UseMutationResult<loginUserRes, AxiosError, LoginSellerDto> => {
  return useMutation<loginUserRes, AxiosError, LoginSellerDto>((dto: LoginSellerDto) =>
    axios
      .post<loginUserRes>('/auth/login', dto, {
        params: {
          type,
        },
      })
      .then((res) => res.data),
  );
};

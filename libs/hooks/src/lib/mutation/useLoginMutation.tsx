import { useMutation, UseMutationResult } from 'react-query';
import { LoginUserDto, loginUserRes, UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useLoginMutation = (
  type: UserType,
): UseMutationResult<loginUserRes | any, AxiosError, LoginUserDto> => {
  return useMutation<loginUserRes | any, AxiosError, LoginUserDto>((dto: LoginUserDto) =>
    axios
      .post<loginUserRes | string>('/auth/login', dto, {
        params: {
          type,
        },
      })
      .then((res) => res.data),
  );
};

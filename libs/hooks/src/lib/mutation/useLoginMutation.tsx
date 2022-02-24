import { useMutation, UseMutationResult } from 'react-query';
import { LoginUserDto, loginUserRes, UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { UserPayload } from '@project-lc/nest-core';
import axios from '../../axios';

export interface InactiveUserPayload extends UserPayload {
  userType: UserType;
}

export const useLoginMutation = (
  type: UserType,
): UseMutationResult<loginUserRes | InactiveUserPayload, AxiosError, LoginUserDto> => {
  return useMutation<loginUserRes | InactiveUserPayload, AxiosError, LoginUserDto>(
    (dto: LoginUserDto) =>
      axios
        .post<loginUserRes | InactiveUserPayload>('/auth/login', dto, {
          params: {
            type,
          },
        })
        .then((res) => res.data),
  );
};

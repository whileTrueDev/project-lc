import { LoginUserDto, loginUserRes, UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface InactiveUserPayload {
  userType: UserType;
  id: number;
  sub: string;
  type: UserType;
  inactiveFlag?: boolean;
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

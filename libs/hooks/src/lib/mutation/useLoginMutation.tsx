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

interface AdditionalLoginInfo {
  id: number;
  userType: UserType;
}

type LoginPayload = (loginUserRes & AdditionalLoginInfo) | InactiveUserPayload;

export const useLoginMutation = (
  type: UserType,
): UseMutationResult<LoginPayload, AxiosError, LoginUserDto> => {
  return useMutation<LoginPayload, AxiosError, LoginUserDto>((dto: LoginUserDto) =>
    axios
      .post<LoginPayload>('/auth/login', dto, {
        params: {
          type,
        },
      })
      .then((res) => res.data),
  );
};

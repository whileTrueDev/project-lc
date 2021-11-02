import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useCodeVerifyMutationDto {
  email: string;
  code: string;
}
export type useCodeVerifyMutationRes = boolean;

export const useCodeVerifyMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  useCodeVerifyMutationDto
> => {
  return useMutation<boolean, AxiosError, useCodeVerifyMutationDto>(
    (dto: useCodeVerifyMutationDto) =>
      axios
        .post<useCodeVerifyMutationRes>('/auth/code-verification', dto)
        .then((res) => res.data),
  );
};

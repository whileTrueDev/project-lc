import { useMutation, UseMutationResult } from 'react-query';
import { LoginUserDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export interface CodeAndMail {
  email: string;
  code: string;
}
export const useMailCodeValidationMutation = (): UseMutationResult<
  CodeAndMail,
  AxiosError,
  any
> => {
  return useMutation<CodeAndMail, AxiosError, any>((dto: CodeAndMail) =>
    axios
      .post<any>('auth/code-validation', dto, {
        params: {
          dto,
        },
      })
      .then((res) => res.data),
  );
};

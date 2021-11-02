import { useMutation, UseMutationResult } from 'react-query';
import { SendMailVerificationDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export type useMailVerificationMutationRes = boolean;

export const useMailVerificationMutation = (): UseMutationResult<
  useMailVerificationMutationRes,
  AxiosError,
  SendMailVerificationDto
> => {
  return useMutation<useMailVerificationMutationRes, AxiosError, SendMailVerificationDto>(
    (dto: SendMailVerificationDto) =>
      axios
        .post<useMailVerificationMutationRes>('/auth/mail-verification', dto)
        .then((res) => res.data),
  );
};

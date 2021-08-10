import { useMutation } from 'react-query';
import { SendMailVerificationDto } from '@project-lc/shared-types';
import axios from '../../axios';

export type useMailVerificationMutationRes = boolean;

export const useMailVerificationMutation = () => {
  return useMutation((dto: SendMailVerificationDto) =>
    axios.post<useMailVerificationMutationRes>('/auth/mail-verification', dto),
  );
};

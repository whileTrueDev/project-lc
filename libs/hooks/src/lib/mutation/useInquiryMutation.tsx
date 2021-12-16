import { useMutation, UseMutationResult } from 'react-query';
import { InquiryDTO } from '@project-lc/shared-types';
import { Inquiry } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useInquiryMutation = (): UseMutationResult<
  Inquiry,
  AxiosError,
  InquiryDTO
> => {
  return useMutation(async (dto: InquiryDTO) => {
    return axios.post<Inquiry>('/inquiry', dto).then((res) => res.data);
  });
};

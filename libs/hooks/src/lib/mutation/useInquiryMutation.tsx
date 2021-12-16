import { useMutation, UseMutationResult } from 'react-query';
import { InquiryDto } from '@project-lc/shared-types';
import { Inquiry } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useInquiryMutation = (): UseMutationResult<
  Inquiry,
  AxiosError,
  InquiryDto
> => {
  return useMutation(async (dto: InquiryDto) => {
    return axios.post<Inquiry>('/inquiry', dto).then((res) => res.data);
  });
};

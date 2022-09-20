import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
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

export const useChangeInquiryReadFlagMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inquiryId: number) => {
      return axios.patch('/inquiry', { inquiryId }).then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('AdminSidebarNotiCounts', {
          refetchInactive: true,
        });
      },
    },
  );
};

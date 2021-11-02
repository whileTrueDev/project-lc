import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Notice } from '@prisma/client';
import { NoticePostDto, NoticePatchDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

// 공지사항 생성 작업을 진행한다.
export const useNoticeMutation = (): UseMutationResult<
  any,
  AxiosError,
  NoticePostDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, NoticePostDto>(
    (dto: NoticePostDto) => {
      return axios.post<Notice>(`/notice`, dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Notice', { refetchInactive: true });
      },
    },
  );
};

// 공지사항 상태변경 작업을 진행한다.
export const useNoticeFlagMutation = (): UseMutationResult<
  any,
  AxiosError,
  NoticePatchDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, NoticePatchDto>(
    (dto: NoticePatchDto) => {
      return axios.patch<NoticePatchDto>(`/notice`, dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Notice', { refetchInactive: true });
      },
    },
  );
};

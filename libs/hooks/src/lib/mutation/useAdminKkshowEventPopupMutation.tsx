import { KkshowEventPopup } from '@prisma/client';
import { CreateEventPopupDto, UpdateEventPopupDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

// 생성 뮤테이션
export type useAdminCreateEventPopupMutationRes = KkshowEventPopup;
export type useAdminCreateEventPopupMutationDto = CreateEventPopupDto;
export const useAdminCreateEventPopupMutation = (): UseMutationResult<
  useAdminCreateEventPopupMutationRes,
  AxiosError,
  useAdminCreateEventPopupMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminCreateEventPopupMutationRes,
    AxiosError,
    useAdminCreateEventPopupMutationDto
  >(
    (dto: useAdminCreateEventPopupMutationDto) =>
      axios
        .post<useAdminCreateEventPopupMutationRes>('/admin/kkshow-event-popup', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('KkshowEventPopup');
      },
    },
  );
};

// 수정 뮤테이션
export type useAdminUpdateEventPopupMutationRes = boolean;
export type useAdminUpdateEventPopupMutationDto = {
  id: KkshowEventPopup['id'];
  dto: UpdateEventPopupDto;
};
export const useAdminUpdateEventPopupMutation = (): UseMutationResult<
  useAdminUpdateEventPopupMutationRes,
  AxiosError,
  useAdminUpdateEventPopupMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminUpdateEventPopupMutationRes,
    AxiosError,
    useAdminUpdateEventPopupMutationDto
  >(
    (dto: useAdminUpdateEventPopupMutationDto) =>
      axios
        .patch<useAdminUpdateEventPopupMutationRes>(
          `/admin/kkshow-event-popup/${dto.id}`,
          dto.dto,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('KkshowEventPopup');
      },
    },
  );
};

// 삭제 뮤테이션
export type useAdminDeleteEventPopupMutationRes = boolean;
export type useAdminDeleteEventPopupMutationDto = { id: KkshowEventPopup['id'] };
export const useAdminDeleteEventPopupMutation = (): UseMutationResult<
  useAdminDeleteEventPopupMutationRes,
  AxiosError,
  useAdminDeleteEventPopupMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminDeleteEventPopupMutationRes,
    AxiosError,
    useAdminDeleteEventPopupMutationDto
  >(
    (dto: useAdminDeleteEventPopupMutationDto) =>
      axios
        .delete<useAdminDeleteEventPopupMutationRes>(
          `/admin/kkshow-event-popup/${dto.id}`,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('KkshowEventPopup');
      },
    },
  );
};

import { KkshowBcList } from '@prisma/client';
import { CreateKkshowBcListDto, DeleteKkshowBcListDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { kkshowBcListQueryKey } from '../queries/useKkshowBcList';

export type useAdminKkshowBcListMutationDto = CreateKkshowBcListDto;
export type useAdminKkshowBcListMutationRes = KkshowBcList;
export const useAdminKkshowBcListMutation = (): UseMutationResult<
  useAdminKkshowBcListMutationRes,
  AxiosError,
  useAdminKkshowBcListMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminKkshowBcListMutationRes,
    AxiosError,
    useAdminKkshowBcListMutationDto
  >(
    (dto: useAdminKkshowBcListMutationDto) =>
      axios
        .post<useAdminKkshowBcListMutationRes>('/admin/kkshow-bc-list', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(kkshowBcListQueryKey);
      },
    },
  );
};

export type useAdminKkshowBcListDeleteMutationDto = DeleteKkshowBcListDto;
export type useAdminKkshowBcListDeleteMutationRes = KkshowBcList;
export const useAdminKkshowBcListDeleteMutation = (): UseMutationResult<
  useAdminKkshowBcListDeleteMutationRes,
  AxiosError,
  useAdminKkshowBcListDeleteMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminKkshowBcListDeleteMutationRes,
    AxiosError,
    useAdminKkshowBcListDeleteMutationDto
  >(
    (dto: useAdminKkshowBcListDeleteMutationDto) =>
      axios
        .delete<useAdminKkshowBcListDeleteMutationRes>(`/admin/kkshow-bc-list/${dto.id}`)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(kkshowBcListQueryKey);
      },
    },
  );
};

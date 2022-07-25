import { KkshowSubNavLink } from '@prisma/client';
import { CreateKkshowSubNavDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useSubNavCreateMutationRes = KkshowSubNavLink;
export const useSubNavCreateMutation = (): UseMutationResult<
  useSubNavCreateMutationRes,
  AxiosError,
  CreateKkshowSubNavDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useSubNavCreateMutationRes, AxiosError, CreateKkshowSubNavDto>(
    (dto: CreateKkshowSubNavDto) =>
      axios
        .post<useSubNavCreateMutationRes>('/kkshow-subnav', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('KkshowSubNav');
      },
    },
  );
};

export const useSubNavDeleteMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, number>(
    (id: number) => axios.delete<boolean>(`/kkshow-subnav/${id}`).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('KkshowSubNav');
      },
    },
  );
};

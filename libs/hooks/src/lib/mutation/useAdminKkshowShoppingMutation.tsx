import { KkshowShoppingDto, KkshowShoppingTabResData } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useAdminKkshowShoppingMutationRes = KkshowShoppingTabResData;

export const useAdminKkshowShoppingMutation = (): UseMutationResult<
  useAdminKkshowShoppingMutationRes,
  AxiosError,
  KkshowShoppingDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useAdminKkshowShoppingMutationRes, AxiosError, KkshowShoppingDto>(
    (dto: KkshowShoppingDto) =>
      axios
        .put<useAdminKkshowShoppingMutationRes>('/admin/kkshow-shopping', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('KkshowShopping');
      },
    },
  );
};

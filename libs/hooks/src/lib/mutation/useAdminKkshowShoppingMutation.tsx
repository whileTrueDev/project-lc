import { KkshowShoppingSectionItem } from '@prisma/client';
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

export type AdminUpdateKkshowShoppingSectionDataDto = {
  id: number;
  dto: Omit<KkshowShoppingSectionItem, 'id'>;
};
export const useAdminUpdateKkshowShoppingSectionData = (): UseMutationResult<
  boolean,
  AxiosError,
  AdminUpdateKkshowShoppingSectionDataDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, AdminUpdateKkshowShoppingSectionDataDto>(
    (dto: AdminUpdateKkshowShoppingSectionDataDto) =>
      axios
        .put<boolean>(`/admin/kkshow-shopping/section/${dto.id}`, dto.dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('KkshowShopping');
        queryClient.invalidateQueries('tempKkshowShopping');
        queryClient.invalidateQueries('AdminKkshowShoppingSections');
      },
    },
  );
};

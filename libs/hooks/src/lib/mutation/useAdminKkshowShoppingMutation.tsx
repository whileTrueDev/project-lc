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

/** 특정 섹션데이터 수정 */
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

/** 특정 섹션데이터 삭제 */
export type AdminDeleteKkshowShoppingSectionDataDto = {
  id: number;
};
export const useAdminDeleteKkshowShoppingSectionData = (): UseMutationResult<
  boolean,
  AxiosError,
  AdminDeleteKkshowShoppingSectionDataDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, AdminDeleteKkshowShoppingSectionDataDto>(
    (dto: AdminDeleteKkshowShoppingSectionDataDto) =>
      axios
        .delete<boolean>(`/admin/kkshow-shopping/section/${dto.id}`)
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

/** 섹선 순서 수정 */
export type AdminUpdateKkshowShoppingSectionOrderDto = {
  order: number[];
};
export const useAdminUpdateKkshowShoppingSectionOrder = (): UseMutationResult<
  boolean,
  AxiosError,
  AdminUpdateKkshowShoppingSectionOrderDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, AdminUpdateKkshowShoppingSectionOrderDto>(
    (dto: AdminUpdateKkshowShoppingSectionOrderDto) =>
      axios.put<boolean>(`/admin/kkshow-shopping/order`, dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('KkshowShopping');
        queryClient.invalidateQueries('tempKkshowShopping');
        queryClient.invalidateQueries('AdminShoppingSectionOrder');
      },
    },
  );
};

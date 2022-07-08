import { GoodsCategory } from '@prisma/client';
import { CreateGoodsCategoryDto, UpdateGoodsCategoryDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

// 생성 뮤테이션
export const useAdminCategoryCreateMutation = (): UseMutationResult<
  GoodsCategory,
  AxiosError,
  CreateGoodsCategoryDto
> => {
  const queryClient = useQueryClient();
  return useMutation<GoodsCategory, AxiosError, CreateGoodsCategoryDto>(
    (dto: CreateGoodsCategoryDto) =>
      axios.post<GoodsCategory>('/admin/goods-category', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminCategory');
      },
    },
  );
};

// 수정 뮤테이션
export const useAdminCategoryUpdateMutation = (
  id: number,
): UseMutationResult<boolean, AxiosError, UpdateGoodsCategoryDto> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, UpdateGoodsCategoryDto>(
    (dto: UpdateGoodsCategoryDto) =>
      axios.patch<boolean>(`/admin/goods-category/${id}`, dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminCategory');
      },
    },
  );
};

// 삭제 뮤테이션
export const useAdminCategoryDeleteMutation = (
  id: number,
): UseMutationResult<boolean, AxiosError, void> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError>(
    () => axios.delete<boolean>(`/admin/goods-category/${id}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminCategory');
      },
    },
  );
};

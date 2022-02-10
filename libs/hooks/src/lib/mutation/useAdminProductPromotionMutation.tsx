import {
  CreateProductPromotionDto,
  UpdateProductPromotionDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

/** 상품홍보 생성 뮤테이션 */
export type useAdminProductPromotionCreateMutationRes = any;

export const useAdminProductPromotionCreateMutation = (): UseMutationResult<
  useAdminProductPromotionCreateMutationRes,
  AxiosError,
  CreateProductPromotionDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminProductPromotionCreateMutationRes,
    AxiosError,
    CreateProductPromotionDto
  >(
    (dto: CreateProductPromotionDto) =>
      axios
        .post<useAdminProductPromotionCreateMutationRes>('/admin/product-promotion', dto)
        .then((res) => res.data),
    {
      onSuccess: (data, dto) => {
        queryClient.invalidateQueries([
          'AdminProductPromotion',
          dto.broadcasterPromotionPageId,
        ]);
      },
    },
  );
};

/** 상품홍보 수정 뮤테이션 */
export type useAdminProductPromotionUpdateMutationRes = any;

export const useAdminProductPromotionUpdateMutation = (): UseMutationResult<
  useAdminProductPromotionUpdateMutationRes,
  AxiosError,
  UpdateProductPromotionDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminProductPromotionUpdateMutationRes,
    AxiosError,
    UpdateProductPromotionDto
  >(
    (dto: UpdateProductPromotionDto) =>
      axios
        .patch<useAdminProductPromotionUpdateMutationRes>('/admin/product-promotion', dto)
        .then((res) => res.data),
    {
      onSuccess: (data, dto) => {
        queryClient.invalidateQueries([
          'AdminProductPromotion',
          dto.broadcasterPromotionPageId,
        ]);
      },
    },
  );
};

/** 상품홍보 삭제 뮤테이션 */
export type useAdminProductPromotionDeleteMutationRes = boolean;

export const useAdminProductPromotionDeleteMutation = (): UseMutationResult<
  useAdminProductPromotionDeleteMutationRes,
  AxiosError,
  UpdateProductPromotionDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminProductPromotionDeleteMutationRes,
    AxiosError,
    UpdateProductPromotionDto
  >(
    (dto: UpdateProductPromotionDto) =>
      axios
        .delete<useAdminProductPromotionDeleteMutationRes>('/admin/product-promotion', {
          data: dto,
        })
        .then((res) => res.data),
    {
      onSuccess: (data, dto) => {
        queryClient.invalidateQueries([
          'AdminProductPromotion',
          dto.broadcasterPromotionPageId,
        ]);
      },
    },
  );
};

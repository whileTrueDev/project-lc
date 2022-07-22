import { CategoryOnGoodsConnectionDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useCategoryOnGoodsMutationDto = CategoryOnGoodsConnectionDto;
export type useCategoryOnGoodsMutationRes = any;

/** 특정 상품에 카테고리 연결 생성 뮤테이션 */
export const useConnectCategoryOnGoodsMutation = (): UseMutationResult<
  useCategoryOnGoodsMutationRes,
  AxiosError,
  useCategoryOnGoodsMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCategoryOnGoodsMutationRes,
    AxiosError,
    useCategoryOnGoodsMutationDto
  >(
    (dto: useCategoryOnGoodsMutationDto) =>
      axios
        .post<useCategoryOnGoodsMutationRes>('/goods-category', dto)
        .then((res) => res.data),
    {
      onSuccess: (data, dto) => {
        console.log(dto.goodsId);
        queryClient.invalidateQueries('AdminCategory');
        queryClient.invalidateQueries('GoodsById'); // 카테고리 연결된 상품 정보 갱신(연결된 카테고리 다시 불러오기 위해)
        queryClient.invalidateQueries('AdminGoodsById');
      },
    },
  );
};

/** 특정 상품에서 카테고리 연결 해제 뮤테이션 */
export const useDisconnectCategoryOnGoodsMutation = (): UseMutationResult<
  useCategoryOnGoodsMutationRes,
  AxiosError,
  useCategoryOnGoodsMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCategoryOnGoodsMutationRes,
    AxiosError,
    useCategoryOnGoodsMutationDto
  >(
    (dto: useCategoryOnGoodsMutationDto) =>
      axios
        .delete<useCategoryOnGoodsMutationRes>('/goods-category', { data: dto })
        .then((res) => res.data),
    {
      onSuccess: (data, dto) => {
        queryClient.invalidateQueries('AdminCategory');
        queryClient.invalidateQueries('GoodsById');
        queryClient.invalidateQueries('AdminGoodsById');
      },
    },
  );
};

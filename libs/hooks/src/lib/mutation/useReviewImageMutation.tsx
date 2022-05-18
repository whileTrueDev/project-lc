import { GoodsReviewImage } from '@prisma/client';
import { GoodsReviewImageUpdateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useReviewImageDeleteMutationRes = boolean;
export interface useReviewImageDeleteMutationDto extends GoodsReviewImageUpdateDto {
  reviewImageId?: GoodsReviewImage['id'];
}
export const useReviewImageDeleteMutation = (): UseMutationResult<
  useReviewImageDeleteMutationRes,
  AxiosError,
  useReviewImageDeleteMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useReviewImageDeleteMutationRes,
    AxiosError,
    useReviewImageDeleteMutationDto
  >(
    async (dto: useReviewImageDeleteMutationDto) => {
      const { imageUrl, reviewImageId } = dto;
      if (reviewImageId) {
        return axios
          .delete<useReviewImageDeleteMutationRes>(`/goods-review-image/${reviewImageId}`)
          .then((res) => res.data);
      }
      return axios
        .delete<useReviewImageDeleteMutationRes>(`/goods-review-image`, {
          params: { imageUrl },
        })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('InfiniteGoodsReviews');
      },
    },
  );
};

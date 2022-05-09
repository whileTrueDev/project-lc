import { GoodsReview } from '@prisma/client';
import { GoodsReviewUpdateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useReviewUpdateMutationDto extends GoodsReviewUpdateDto {
  reviewId: GoodsReview['id'];
}
export type useReviewUpdateMutationRes = GoodsReview;
/** 리뷰 수정 */
export const useReviewUpdateMutation = (): UseMutationResult<
  useReviewUpdateMutationRes,
  AxiosError,
  useReviewUpdateMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useReviewUpdateMutationRes, AxiosError, useReviewUpdateMutationDto>(
    (dto: useReviewUpdateMutationDto) =>
      axios
        .patch<useReviewUpdateMutationRes>(`/goods-review/${dto.reviewId}`, {
          rating: dto.rating,
          images: dto.images,
          content: dto.content,
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('InfiniteGoodsReviews');
      },
    },
  );
};

export interface useReviewDeleteMutationDto {
  reviewId: GoodsReview['id'];
}
export type useReviewDeleteMutationRes = boolean;
/** 리뷰 삭제 */
export const useReviewDeleteMutation = (): UseMutationResult<
  useReviewDeleteMutationRes,
  AxiosError,
  useReviewDeleteMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useReviewDeleteMutationRes, AxiosError, useReviewDeleteMutationDto>(
    (dto: useReviewDeleteMutationDto) =>
      axios
        .delete<useReviewDeleteMutationRes>(`/goods-review/${dto.reviewId}`)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('InfiniteGoodsReviews');
      },
    },
  );
};

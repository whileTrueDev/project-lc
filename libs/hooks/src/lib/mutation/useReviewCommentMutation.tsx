import { GoodsReview, GoodsReviewComment } from '@prisma/client';
import {
  GoodsReviewCommentCreateDto,
  GoodsReviewCommentUpdateDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useReviewCommentMutationDto extends GoodsReviewCommentCreateDto {
  reviewId: GoodsReview['id'];
}
export type useReviewCommentMutationRes = GoodsReviewComment;
/** 리뷰 댓글 생성 */
export const useReviewCommentMutation = (): UseMutationResult<
  useReviewCommentMutationRes,
  AxiosError,
  useReviewCommentMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useReviewCommentMutationRes,
    AxiosError,
    useReviewCommentMutationDto
  >(
    (dto: useReviewCommentMutationDto) =>
      axios
        .post<useReviewCommentMutationRes>(`/goods-review/${dto.reviewId}/comment`, {
          ...dto,
          reviewId: undefined,
        })
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['GoodsReviewComment', data.reviewId]);
      },
    },
  );
};

export interface useReviewCommentUpdateMutationDto extends GoodsReviewCommentUpdateDto {
  commentId: GoodsReviewComment['id'];
}
export type useReviewCommentUpdateMutationRes = GoodsReviewComment;
/** 리뷰 댓글 수정 */
export const useReviewCommentUpdateMutation = (): UseMutationResult<
  useReviewCommentUpdateMutationRes,
  AxiosError,
  useReviewCommentUpdateMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useReviewCommentUpdateMutationRes,
    AxiosError,
    useReviewCommentUpdateMutationDto
  >(
    (dto: useReviewCommentUpdateMutationDto) =>
      axios
        .patch<useReviewCommentUpdateMutationRes>(
          `/goods-review/${dto.reviewId}/comment/${dto.commentId}`,
          { ...dto, commentId: undefined },
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['GoodsReviewComment', data.reviewId]);
      },
    },
  );
};

export interface useReviewCommentDeleteMutationDto {
  reviewId: GoodsReviewComment['reviewId'];
  commentId: GoodsReviewComment['id'];
}
export type useReviewCommentDeleteMutationRes = boolean;
/** 리뷰 댓글 삭제 */
export const useReviewCommentDeleteMutation = (): UseMutationResult<
  useReviewCommentDeleteMutationRes,
  AxiosError,
  useReviewCommentDeleteMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useReviewCommentDeleteMutationRes,
    AxiosError,
    useReviewCommentDeleteMutationDto
  >(
    (dto: useReviewCommentDeleteMutationDto) =>
      axios
        .delete<useReviewCommentDeleteMutationRes>(
          `/goods-review/${dto.reviewId}/comment/${dto.commentId}`,
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('GoodsReviewComment');
      },
    },
  );
};

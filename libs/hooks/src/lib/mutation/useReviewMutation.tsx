import { GoodsReview } from '@prisma/client';
import {
  GoodsReviewCreateDto,
  GoodsReviewRes,
  GoodsReviewUpdateDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { ORDERITEM_REVIEW_NEEDED_QUERY_KEY } from '../queries/useOrderItem';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';
import { INFINITE_REVIEWS_KEY } from '../queries/useReviews';

export interface useReviewUpdateMutationDto extends GoodsReviewUpdateDto {
  reviewId: GoodsReview['id'];
}
export type useReviewUpdateMutationRes = GoodsReview;
/** 후기 수정 */
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
      onSuccess: (data) => {
        return queryClient.invalidateQueries<GoodsReviewRes>(INFINITE_REVIEWS_KEY, {
          refetchPage: (_lastPage, idx, pages) => {
            const targetPageIdx = pages.findIndex(
              (page) => page.reviews.findIndex((review) => review.id === data.id) > -1,
            );
            return idx === targetPageIdx;
          },
        });
      },
    },
  );
};

export type useReviewCreateMutationDto = GoodsReviewCreateDto;
export type useReviewCreateMutationRes = GoodsReview;
/** 후기 수정 */
export const useReviewCreateMutation = (): UseMutationResult<
  useReviewCreateMutationRes,
  AxiosError,
  useReviewCreateMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useReviewCreateMutationRes, AxiosError, useReviewCreateMutationDto>(
    (dto: useReviewCreateMutationDto) =>
      axios
        .post<useReviewCreateMutationRes>(`/goods-review`, {
          rating: dto.rating,
          images: dto.images,
          content: dto.content,
          goodsId: dto.goodsId,
          writerId: dto.writerId,
          orderItemId: dto.orderItemId,
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INFINITE_REVIEWS_KEY);
        // 후기 작성 가능한 orderItem 목록 캐시 초기화
        queryClient.invalidateQueries(ORDERITEM_REVIEW_NEEDED_QUERY_KEY);
        // 내 주문목록 캐시 초기화
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
        queryClient.invalidateQueries('OrderDetail'); // 주문 상세 초기화
      },
    },
  );
};

export interface useReviewDeleteMutationDto {
  reviewId: GoodsReview['id'];
}
export type useReviewDeleteMutationRes = boolean;
/** 후기 삭제 */
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
        queryClient.invalidateQueries(INFINITE_REVIEWS_KEY);
        // 후기 작성 가능한 orderItem 목록 캐시 초기화
        queryClient.invalidateQueries(ORDERITEM_REVIEW_NEEDED_QUERY_KEY);
        // 내 주문목록 캐시 초기화
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
      },
    },
  );
};

import { Goods, GoodsReview } from '@prisma/client';
import {
  FindManyGoodsReviewDto,
  GoodsReviewCommentRes,
  GoodsReviewRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import axios from '../../axios';

export const getReviews = async (
  dto: FindManyGoodsReviewDto,
): Promise<GoodsReviewRes> => {
  return axios
    .get<GoodsReviewRes>('/goods-review', {
      params: { ...dto },
    })
    .then((res) => res.data);
};

// 상품의 모든 리뷰
export const useReviews = (
  dto: FindManyGoodsReviewDto,
  enabled?: boolean,
): UseQueryResult<GoodsReviewRes, AxiosError> => {
  return useQuery<GoodsReviewRes, AxiosError>(['Reviews', dto], () => getReviews(dto), {
    enabled,
  });
};

// 상품 리뷰
export const INFINITE_REVIEWS_KEY = 'InfiniteGoodsReviews';
export const useInfiniteReviews = (
  dto: FindManyGoodsReviewDto,
  enabled = true,
): UseInfiniteQueryResult<GoodsReviewRes, AxiosError> => {
  return useInfiniteQuery(
    INFINITE_REVIEWS_KEY,
    ({ pageParam = 0 }) => getReviews({ ...dto, skip: pageParam }),
    {
      getNextPageParam(prev) {
        return prev.nextCursor;
      },
      enabled,
      refetchOnMount: true,
    },
  );
};

// 상품의 총 리뷰 개수
export const getReviewCount = async (goodsId: Goods['id'] | string): Promise<number> => {
  return axios
    .get<number>('/goods-review/count', { params: { goodsId: Number(goodsId) } })
    .then((res) => res.data);
};
export const useGoodsReviewCount = (
  goodsId: Goods['id'] | string,
): UseQueryResult<number, AxiosError> => {
  return useQuery<number, AxiosError>(
    ['GoodsReviewCount', goodsId],
    () => getReviewCount(goodsId),
    {
      enabled: !!goodsId,
    },
  );
};

// 특정 리뷰의 모든 댓글
export const getReviewComments = async (
  reviewId: GoodsReview['id'],
): Promise<GoodsReviewCommentRes> => {
  return axios
    .get<GoodsReviewCommentRes>(`/goods-review/${reviewId}/comment`)
    .then((res) => res.data);
};
export const useGoodsReviewComments = (
  reviewId: GoodsReview['id'],
): UseQueryResult<GoodsReviewCommentRes, AxiosError> => {
  return useQuery<GoodsReviewCommentRes, AxiosError>(
    ['GoodsReviewComment', reviewId],
    () => getReviewComments(reviewId),
    {
      enabled: !!reviewId,
    },
  );
};

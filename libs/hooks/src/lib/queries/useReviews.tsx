import { FindManyGoodsReviewDto, GoodsReviewRes } from '@project-lc/shared-types';
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

export const useReviews = (
  dto: FindManyGoodsReviewDto,
  enabled?: boolean,
): UseQueryResult<GoodsReviewRes, AxiosError> => {
  return useQuery<GoodsReviewRes, AxiosError>(['Reviews', dto], () => getReviews(dto), {
    enabled,
  });
};

export const INFINITE_REVIWS_KEY = 'InfiniteReviews';
export const useInfiniteReviews = (
  dto: FindManyGoodsReviewDto,
): UseInfiniteQueryResult<GoodsReviewRes, AxiosError> => {
  return useInfiniteQuery(
    INFINITE_REVIWS_KEY,
    ({ pageParam = 0 }) => getReviews({ ...dto, skip: pageParam }),
    {
      getNextPageParam(prev) {
        return prev.nextCursor;
      },
    },
  );
};

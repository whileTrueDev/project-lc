import { GoodsInquiry } from '@prisma/client';
import {
  FindManyGoodsInquiryDto,
  FindManyGoodsReviewDto,
  GoodsInquiryCommentRes,
  PaginatedGoodsInquiryRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  UseQueryResult,
} from 'react-query';
import axios from '../../axios';

export const getInquiries = async (
  dto: FindManyGoodsInquiryDto,
): Promise<PaginatedGoodsInquiryRes> => {
  return axios
    .get<PaginatedGoodsInquiryRes>('/goods-inquiry', {
      params: { ...dto },
    })
    .then((res) => res.data);
};
export const INFINITE_INQUIRIES_KEY = 'InfiniteInquiries';
export const useInfiniteGoodsInquiries = (
  dto: FindManyGoodsReviewDto,
  options?: { enabled?: boolean },
): UseInfiniteQueryResult<PaginatedGoodsInquiryRes, AxiosError> => {
  return useInfiniteQuery(
    INFINITE_INQUIRIES_KEY,
    ({ pageParam = 0 }) => getInquiries({ ...dto, skip: pageParam }),
    {
      getNextPageParam(prev) {
        return prev.nextCursor;
      },
      enabled: options?.enabled,
    },
  );
};

export const getInquiryComments = async (
  inquiryId: GoodsInquiry['id'],
): Promise<GoodsInquiryCommentRes> => {
  return axios
    .get<GoodsInquiryCommentRes>(`/goods-inquiry/${inquiryId}/comment`)
    .then((res) => res.data);
};
export const useGoodsInquiryComments = (
  inquiryId: GoodsInquiry['id'],
): UseQueryResult<GoodsInquiryCommentRes, AxiosError> => {
  return useQuery<GoodsInquiryCommentRes, AxiosError>(
    ['GoodsInquiryComment', inquiryId],
    () => getInquiryComments(inquiryId),
    {
      enabled: !!inquiryId,
    },
  );
};

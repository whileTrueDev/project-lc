import { GoodsInquiry, GoodsInquiryComment } from '@prisma/client';
import { GoodsInquiryCommentDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { INFINITE_INQUIRIES_KEY } from '../queries/useGoodsInquiries';

export interface useGoodsInquiryCommentMutationDto extends GoodsInquiryCommentDto {
  goodsInquiryId: GoodsInquiry['id'];
}
export type useGoodsInquiryCommentMutationRes = GoodsInquiryComment;
/** 상품 문의 답변 생성 */
export const useGoodsInquiryCommentMutation = (): UseMutationResult<
  useGoodsInquiryCommentMutationRes,
  AxiosError,
  useGoodsInquiryCommentMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useGoodsInquiryCommentMutationRes,
    AxiosError,
    useGoodsInquiryCommentMutationDto
  >(
    (dto: useGoodsInquiryCommentMutationDto) =>
      axios
        .post<useGoodsInquiryCommentMutationRes>(
          `/goods-inquiry/${dto.goodsInquiryId}/comment`,
          { ...dto, goodsInquiryId: undefined },
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(INFINITE_INQUIRIES_KEY);
        queryClient.invalidateQueries(['GoodsInquiryComment', data.goodsInquiryId], {
          refetchInactive: true,
        });
        queryClient.invalidateQueries('AdminSidebarNotiCounts', {
          refetchInactive: true,
        });
      },
    },
  );
};

export interface useGoodsInquiryCommentUpdateMutationDto extends GoodsInquiryCommentDto {
  goodsInquiryCommentId: GoodsInquiryComment['id'];
  goodsInquiryId: GoodsInquiry['id'];
}
export type useGoodsInquiryCommentUpdateMutationRes = GoodsInquiryComment;
/** 상품 문의 답변 수정 */
export const useGoodsInquiryCommentUpdateMutation = (): UseMutationResult<
  useGoodsInquiryCommentUpdateMutationRes,
  AxiosError,
  useGoodsInquiryCommentUpdateMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useGoodsInquiryCommentUpdateMutationRes,
    AxiosError,
    useGoodsInquiryCommentUpdateMutationDto
  >(
    (dto: useGoodsInquiryCommentUpdateMutationDto) =>
      axios
        .patch<useGoodsInquiryCommentUpdateMutationRes>(
          `/goods-inquiry/${dto.goodsInquiryId}/comment/${dto.goodsInquiryCommentId}`,
          { ...dto, goodsInquiryId: undefined, goodsInquiryCommentId: undefined },
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['GoodsInquiryComment', data.goodsInquiryId], {
          refetchInactive: true,
        });
      },
    },
  );
};

export interface useGoodsInquiryCommentDeleteMutationDto {
  goodsInquiryCommentId: GoodsInquiryComment['id'];
  goodsInquiryId: GoodsInquiry['id'];
}
export type useGoodsInquiryCommentDeleteMutationRes = boolean;
/** 상품 문의 답변 삭제 */
export const useGoodsInquiryCommentDeleteMutation = (): UseMutationResult<
  useGoodsInquiryCommentDeleteMutationRes,
  AxiosError,
  useGoodsInquiryCommentDeleteMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useGoodsInquiryCommentDeleteMutationRes,
    AxiosError,
    useGoodsInquiryCommentDeleteMutationDto
  >(
    (dto: useGoodsInquiryCommentDeleteMutationDto) =>
      axios
        .delete<useGoodsInquiryCommentDeleteMutationRes>(
          `/goods-inquiry/${dto.goodsInquiryId}/comment/${dto.goodsInquiryCommentId}`,
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INFINITE_INQUIRIES_KEY);
        queryClient.invalidateQueries('GoodsInquiryComment', { refetchInactive: true });
      },
    },
  );
};

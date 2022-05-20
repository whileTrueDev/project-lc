import { GoodsInquiry, GoodsInquiryComment } from '@prisma/client';
import { GoodsInquiryCommentDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useGoodsInquiryCommentMutationDto extends GoodsInquiryCommentDto {
  goodsInquiryId: GoodsInquiry['id'];
}
export type useGoodsInquiryCommentMutationRes = GoodsInquiryComment;

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
        queryClient.invalidateQueries(['GoodsInquiryComment', data.goodsInquiryId]);
      },
    },
  );
};

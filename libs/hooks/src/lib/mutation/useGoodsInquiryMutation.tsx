import { GoodsInquiry } from '@prisma/client';
import { GoodsInquiryCreateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useGoodsInquiryMutationRes = GoodsInquiry;

export const useGoodsInquiryMutation = (): UseMutationResult<
  useGoodsInquiryMutationRes,
  AxiosError,
  GoodsInquiryCreateDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useGoodsInquiryMutationRes, AxiosError, GoodsInquiryCreateDto>(
    (dto: GoodsInquiryCreateDto) =>
      axios
        .post<useGoodsInquiryMutationRes>('/goods-inquiry', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('InfiniteInquiries');
      },
    },
  );
};

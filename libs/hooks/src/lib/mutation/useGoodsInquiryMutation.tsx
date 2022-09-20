import { GoodsInquiry } from '@prisma/client';
import { GoodsInquiryCreateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { INFINITE_INQUIRIES_KEY } from '../queries/useGoodsInquiries';

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
      onSuccess: (data) => {
        queryClient.invalidateQueries(INFINITE_INQUIRIES_KEY);
        queryClient.invalidateQueries(['GoodsInquiryComment', data.id]);
      },
    },
  );
};

export type useGoodsInquiryDeleteMutationRes = boolean;
export const useGoodsInquiryDeleteMutation = (): UseMutationResult<
  useGoodsInquiryDeleteMutationRes,
  AxiosError,
  GoodsInquiry['id']
> => {
  const queryClient = useQueryClient();
  return useMutation<useGoodsInquiryDeleteMutationRes, AxiosError, GoodsInquiry['id']>(
    (goodsInquiryId: GoodsInquiry['id']) =>
      axios
        .delete<useGoodsInquiryDeleteMutationRes>(`/goods-inquiry/${goodsInquiryId}`)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INFINITE_INQUIRIES_KEY);
        queryClient.invalidateQueries('GoodsInquiryComment');
        queryClient.invalidateQueries('AdminSidebarNotiCounts', {
          refetchInactive: true,
        });
      },
    },
  );
};

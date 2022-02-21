import { BroadcasterPromotionPage } from '@prisma/client';
import {
  BroadcasterPromotionPageDto,
  BroadcasterPromotionPageUpdateDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

/** 방송인 상품홍보페이지 생성 */
export type useAdminBroadcasterPromotionPageCreateMutationRes = BroadcasterPromotionPage;
type CreateDto = BroadcasterPromotionPageDto;
export const useAdminBroadcasterPromotionPageCreateMutation = (): UseMutationResult<
  useAdminBroadcasterPromotionPageCreateMutationRes,
  AxiosError,
  CreateDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminBroadcasterPromotionPageCreateMutationRes,
    AxiosError,
    CreateDto
  >(
    (dto: CreateDto) =>
      axios
        .post<useAdminBroadcasterPromotionPageCreateMutationRes>(
          '/admin/promotion-page',
          dto,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminBroadcasterPromotionPageList');
      },
    },
  );
};

/** 방송인 상품홍보페이지 수정 */
export type useAdminBroadcasterPromotionPageUpdateMutationRes = BroadcasterPromotionPage;
type UpdateDto = BroadcasterPromotionPageUpdateDto;
export const useAdminBroadcasterPromotionPageUpdateMutation = (): UseMutationResult<
  useAdminBroadcasterPromotionPageUpdateMutationRes,
  AxiosError,
  UpdateDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminBroadcasterPromotionPageUpdateMutationRes,
    AxiosError,
    UpdateDto
  >(
    (dto: UpdateDto) =>
      axios
        .patch<useAdminBroadcasterPromotionPageUpdateMutationRes>(
          '/admin/promotion-page',
          dto,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminBroadcasterPromotionPageList');
      },
    },
  );
};

/** 방송인 상품홍보페이지 삭제 */
export type useAdminBroadcasterPromotionPageDeleteMutationRes = boolean;
export type BroadcasterPromotionPageDeleteDto = { pageId: number };
export const useAdminBroadcasterPromotionPageDeleteMutation = (): UseMutationResult<
  useAdminBroadcasterPromotionPageDeleteMutationRes,
  AxiosError,
  BroadcasterPromotionPageDeleteDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminBroadcasterPromotionPageDeleteMutationRes,
    AxiosError,
    BroadcasterPromotionPageDeleteDto
  >(
    (dto: BroadcasterPromotionPageDeleteDto) =>
      axios
        .delete<useAdminBroadcasterPromotionPageDeleteMutationRes>(
          '/admin/promotion-page',
          { data: dto },
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminBroadcasterPromotionPageList');
        queryClient.invalidateQueries('getBroadcaster', { refetchInactive: true });
      },
    },
  );
};

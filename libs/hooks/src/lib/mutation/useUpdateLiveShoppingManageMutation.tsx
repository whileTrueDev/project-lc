import { GoodsView } from '@prisma/client';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useChangeGoodsViewDto {
  view: GoodsView;
  id: number;
}
export type useChangeGoodsViewRes = boolean;

export const useUpdateLiveShoppingManageMutation = (): UseMutationResult<
  useChangeGoodsViewRes,
  AxiosError,
  useChangeGoodsViewDto
> => {
  return useMutation<useChangeGoodsViewRes, AxiosError, useChangeGoodsViewDto>(
    (dto: useChangeGoodsViewDto) =>
      axios.patch('/admin/live-shopping', dto).then((res) => res.data),
  );
};

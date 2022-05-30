import { GoodsView } from '@prisma/client';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useChangeGoodsViewDto {
  view: GoodsView;
  id: number;
}
export type useChangeGoodsViewRes = boolean;

export const useChangeGoodsView = (): UseMutationResult<
  useChangeGoodsViewRes,
  AxiosError,
  useChangeGoodsViewDto
> => {
  return useMutation<useChangeGoodsViewRes, AxiosError, useChangeGoodsViewDto>(
    (dto: useChangeGoodsViewDto) =>
      axios.patch('/goods/expose', dto).then((res) => res.data),
  );
};

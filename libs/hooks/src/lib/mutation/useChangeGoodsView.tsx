import { GoodsView } from '@prisma/client';
import { useMutation } from 'react-query';
import axios from '../../axios';

export interface useChangeGoodsViewDto {
  view: GoodsView;
  id: number;
}
export type useChangeGoodsViewRes = boolean;

export const useChangeGoodsView = () => {
  return useMutation((dto: useChangeGoodsViewDto) => axios.patch('/goods/expose', dto));
};

export const useChangeFmGoodsView = () => {
  return useMutation((dto: useChangeGoodsViewDto) =>
    axios.patch('/fm-goods/expose', dto),
  );
};

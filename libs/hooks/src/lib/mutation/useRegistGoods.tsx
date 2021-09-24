import { RegistGoodsDto } from '@project-lc/shared-types';
import { useMutation } from 'react-query';
import axios from '../../axios';

export type useRegistGoodsDto = RegistGoodsDto;
export type useRegistGoodsRes = any;

export const useRegistGoods = () => {
  return useMutation((dto: useRegistGoodsDto) =>
    axios.post<useRegistGoodsRes>('/goods', dto),
  );
};

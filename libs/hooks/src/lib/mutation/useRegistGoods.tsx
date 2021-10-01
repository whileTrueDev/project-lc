import { RegistGoodsDto } from '@project-lc/shared-types';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useRegistGoodsDto = RegistGoodsDto;
export type useRegistGoodsRes = any;

export const useRegistGoods = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: useRegistGoodsDto) => axios.post<useRegistGoodsRes>('/goods', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SellerGoodsList', { refetchInactive: true });
        queryClient.invalidateQueries('ShippingGroupList', { refetchInactive: true });
      },
    },
  );
};

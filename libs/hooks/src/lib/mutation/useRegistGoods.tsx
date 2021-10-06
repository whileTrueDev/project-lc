import { RegistGoodsDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useRegistGoodsDto = RegistGoodsDto;
export type useRegistGoodsRes = any;

export const useRegistGoods = (): UseMutationResult<
  useRegistGoodsRes,
  AxiosError,
  useRegistGoodsDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useRegistGoodsRes, AxiosError, useRegistGoodsDto>(
    (dto: useRegistGoodsDto) => axios.post<useRegistGoodsRes>('/goods', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SellerGoodsList', { refetchInactive: true });

        queryClient.invalidateQueries('ShippingGroupList', { refetchInactive: true }); // 상품 등록 후  배송비정책에 연결된 상품개수 업데이트
      },
    },
  );
};

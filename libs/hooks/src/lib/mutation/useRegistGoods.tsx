import { RegistGoodsDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

/** 상품 ****등록**** mutation */
export type useRegistGoodsDto = RegistGoodsDto;
export type useRegistGoodsRes = { goodsId: number };

export const useRegistGoods = (): UseMutationResult<
  useRegistGoodsRes,
  AxiosError,
  useRegistGoodsDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useRegistGoodsRes, AxiosError, useRegistGoodsDto>(
    (dto: useRegistGoodsDto) =>
      axios.post<useRegistGoodsRes>('/goods', dto).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SellerGoodsList', { refetchInactive: true });

        queryClient.invalidateQueries('ShippingGroupList', { refetchInactive: true }); // 상품 등록 후  배송비정책에 연결된 상품개수 업데이트
      },
    },
  );
};

/** 상품 ****수정**** mutation */
export type useEditGoodsDto = { id: number; dto: RegistGoodsDto };
export type useEditGoodsRes = useRegistGoodsRes;

export const useEditGoods = (): UseMutationResult<
  useEditGoodsRes,
  AxiosError,
  useEditGoodsDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useEditGoodsRes, AxiosError, useEditGoodsDto>(
    (dto: useEditGoodsDto) =>
      axios.put<useEditGoodsRes>(`/goods/${dto.id}`, dto.dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        const { goodsId } = data;
        queryClient.invalidateQueries('SellerGoodsList', { refetchInactive: true });

        queryClient.invalidateQueries('ShippingGroupList', { refetchInactive: true }); // 상품 등록 후  배송비정책에 연결된 상품개수 업데이트

        // 상품 상세, 상품 수정페이지에서 사용하는 useGoodsById 에 goodsId 가 string으로 전달됨
        queryClient.invalidateQueries(['GoodsById', goodsId.toString()], {
          exact: true,
          refetchInactive: true,
        });
      },
    },
  );
};

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
      },
    },
  );
};

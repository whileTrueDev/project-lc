import { DeleteGoodsDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

// project-lc DB Goods 테이블에 저장된 상품정보 삭제
export const useDeleteLcGoods = (): UseMutationResult<
  any,
  AxiosError,
  DeleteGoodsDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, DeleteGoodsDto>(
    (dto: DeleteGoodsDto) =>
      axios.delete<any>('/goods', { data: dto }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ShippingGroupList', { refetchInactive: true });
      },
    },
  );
};

// 검수 후 퍼스트몰 db fm_goods 테이블에 등록된 상품정보 삭제
export const useDeleteFmGoods = (): UseMutationResult<
  any,
  AxiosError,
  DeleteGoodsDto
> => {
  return useMutation<any, AxiosError, DeleteGoodsDto>((dto: DeleteGoodsDto) =>
    axios.delete<any>('/fm-goods', { data: dto }).then((res) => res.data),
  );
};

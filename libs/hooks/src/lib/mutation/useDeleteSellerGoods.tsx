import { DeleteGoodsDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

// 크크쇼 DB Goods 테이블에 저장된 상품정보 삭제
export const useDeleteLcGoods = (): UseMutationResult<
  boolean,
  AxiosError,
  DeleteGoodsDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, DeleteGoodsDto>(
    (dto: DeleteGoodsDto) =>
      axios.delete<boolean>('/goods', { data: dto }).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SellerGoodsList');
        queryClient.invalidateQueries('ShippingGroupList', { refetchInactive: true });
      },
    },
  );
};

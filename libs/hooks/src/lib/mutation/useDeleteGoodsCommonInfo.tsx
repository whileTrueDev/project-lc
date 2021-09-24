import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface useDeleteGoodsCommonInfoDto {
  id: number;
}
export type useDeleteGoodsCommonInfoRes = boolean;

export const useDeleteGoodsCommonInfo = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: useDeleteGoodsCommonInfoDto) =>
      axios.delete<useDeleteGoodsCommonInfoRes>('/goods/common-info', { data: dto }),
    {
      onSuccess: (data, dto) => {
        queryClient.invalidateQueries('GoodsCommonInfoList');
        queryClient.removeQueries(['GoodsCommonInfoItem', dto.id], { exact: true });
      },
    },
  );
};

import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface useDeleteGoodsCommonInfoDto {
  id: number;
}
export type useDeleteGoodsCommonInfoRes = boolean;

export const useDeleteGoodsCommonInfo = (): UseMutationResult<
  boolean,
  AxiosError,
  useDeleteGoodsCommonInfoDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, useDeleteGoodsCommonInfoDto>(
    (dto: useDeleteGoodsCommonInfoDto) =>
      axios.delete<boolean>('/goods/common-info', { data: dto }).then((res) => res.data),
    {
      onSuccess: (data, dto) => {
        queryClient.invalidateQueries('GoodsCommonInfoList');
        queryClient.removeQueries(['GoodsCommonInfoItem', dto.id], { exact: true });
      },
    },
  );
};

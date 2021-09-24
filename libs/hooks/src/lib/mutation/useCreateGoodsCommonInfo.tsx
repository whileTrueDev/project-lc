import { GoodsInfoDto } from '@project-lc/shared-types';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCreateCommonInfoRes = { id: number };

export const useCreateGoodsCommonInfo = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: GoodsInfoDto) => axios.post<useCreateCommonInfoRes>('/goods/common-info', dto),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('GoodsCommonInfoList');
      },
    },
  );
};

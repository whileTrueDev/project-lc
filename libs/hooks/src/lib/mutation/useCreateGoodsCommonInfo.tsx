import { GoodsInfoDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCreateCommonInfoRes = { id: number };

export const useCreateGoodsCommonInfo = (): UseMutationResult<
  useCreateCommonInfoRes,
  AxiosError,
  GoodsInfoDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useCreateCommonInfoRes, AxiosError, GoodsInfoDto>(
    (dto: GoodsInfoDto) =>
      axios
        .post<useCreateCommonInfoRes>('/goods/common-info', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('GoodsCommonInfoList');
      },
    },
  );
};

import { useMutation, UseMutationResult } from 'react-query';
import { GoodsRejectionDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useGoodRejectionMutation = (): UseMutationResult<
  any,
  AxiosError,
  GoodsRejectionDto
> => {
  return useMutation<any, AxiosError, GoodsRejectionDto>((dto: GoodsRejectionDto) => {
    return axios.put<any>(`/admin/goods/reject`, dto);
  });
};

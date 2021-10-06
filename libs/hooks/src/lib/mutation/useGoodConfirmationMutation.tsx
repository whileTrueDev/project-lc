import { useMutation, UseMutationResult } from 'react-query';
import { GoodsConfirmationDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useGoodConfirmationMutation = (): UseMutationResult<
  any,
  AxiosError,
  GoodsConfirmationDto
> => {
  return useMutation<any, AxiosError, GoodsConfirmationDto>(
    (dto: GoodsConfirmationDto) => {
      return axios.put<any>(`/admin/goods/confirm`, dto);
    },
  );
};

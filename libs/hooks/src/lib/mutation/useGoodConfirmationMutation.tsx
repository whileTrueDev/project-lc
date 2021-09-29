import { useMutation } from 'react-query';
import { GoodsConfirmationDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useGoodConfirmationMutation = () => {
  return useMutation((dto: GoodsConfirmationDto) => {
    return axios.put<any>(`/admin/goods/confirm`, dto);
  });
};

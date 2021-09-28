import { useMutation } from 'react-query';
import { GoodsRejectionDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useGoodRejectionMutation = () => {
  return useMutation((dto: GoodsRejectionDto) => {
    return axios.put<any>(`/admin/goods/reject`, dto);
  });
};

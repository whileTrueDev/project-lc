import { useMutation } from 'react-query';
import { SellerStoreInfoDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useStoreInfoMutation = () => {
  return useMutation((dto: SellerStoreInfoDto) => {
    return axios.patch<SellerStoreInfoDto>('/seller/store', dto);
  });
};

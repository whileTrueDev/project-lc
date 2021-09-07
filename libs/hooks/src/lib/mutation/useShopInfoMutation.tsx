import { useMutation } from 'react-query';
import { SellerShopInfoDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useShopInfoMutation = () => {
  return useMutation((dto: SellerShopInfoDto) => {
    return axios.patch<SellerShopInfoDto>('/seller/shop', dto);
  });
};

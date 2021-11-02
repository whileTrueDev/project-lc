import { useMutation, UseMutationResult } from 'react-query';
import { SellerShopInfoDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useShopInfoMutation = (): UseMutationResult<
  any,
  AxiosError,
  SellerShopInfoDto
> => {
  return useMutation<any, AxiosError, SellerShopInfoDto>((dto: SellerShopInfoDto) => {
    return axios.patch('/seller/shop-info', dto);
  });
};

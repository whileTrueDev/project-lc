import { CartItemRes } from '@project-lc/shared-types';
import { getCartKey } from '@project-lc/utils-frontend';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCart = async (): Promise<CartItemRes> => {
  return axios
    .get<CartItemRes>('/cart', {
      params: { tempUserId: getCartKey() },
    })
    .then((res) => res.data);
};

export const useCart = (
  initialData?: CartItemRes,
): UseQueryResult<CartItemRes, AxiosError> => {
  return useQuery<CartItemRes, AxiosError>('Cart', getCart, { initialData });
};

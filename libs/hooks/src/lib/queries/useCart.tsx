import { Customer } from '@prisma/client';
import { CartItemRes } from '@project-lc/shared-types';
import { getCartKey } from '@project-lc/utils-frontend';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCart = async (customerId?: Customer['id']): Promise<CartItemRes> => {
  return axios
    .get<CartItemRes>('/cart', {
      params: {
        customerId,
        tempUserId: getCartKey(),
      },
    })
    .then((res) => res.data);
};

export const useCart = (
  customerId?: Customer['id'],
  initialData?: CartItemRes,
): UseQueryResult<CartItemRes, AxiosError> => {
  return useQuery<CartItemRes, AxiosError>('Cart', () => getCart(customerId), {
    initialData,
  });
};

import { CartItem, CartItemOption, Customer } from '@prisma/client';
import {
  CartItemDto,
  CartItemOptionQuantityDto,
  CartMigrationDto,
} from '@project-lc/shared-types';
import { getCartKey } from '@project-lc/utils-frontend';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCartItemOptDeleteMutationRes = boolean;
/** 장바구니 상품 옵션 삭제 */
export const useCartItemOptDeleteMutation = (): UseMutationResult<
  useCartItemOptDeleteMutationRes,
  AxiosError,
  CartItemOption['id']
> => {
  const queryClient = useQueryClient();
  return useMutation<useCartItemOptDeleteMutationRes, AxiosError, CartItemOption['id']>(
    (cartItemOptionId: CartItemOption['id']) =>
      axios
        .delete<useCartItemOptDeleteMutationRes>(`/cart/option/${cartItemOptionId}`)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Cart');
      },
    },
  );
};

export type useCartItemDeleteMutationRes = boolean;
/** 장바구니 상품 삭제 */
export const useCartItemDeleteMutation = (): UseMutationResult<
  useCartItemDeleteMutationRes,
  AxiosError,
  CartItem['id']
> => {
  const queryClient = useQueryClient();
  return useMutation<useCartItemDeleteMutationRes, AxiosError, CartItem['id']>(
    (cartItemId: CartItem['id']) =>
      axios
        .delete<useCartItemDeleteMutationRes>(`/cart/${cartItemId}`)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Cart');
      },
    },
  );
};

export type useCartTruncateMutationRes = boolean;
/** 장바구니 모두 비우기 */
export const useCartTruncateMutation = (): UseMutationResult<
  useCartTruncateMutationRes,
  AxiosError,
  undefined
> => {
  const queryClient = useQueryClient();
  return useMutation<useCartTruncateMutationRes, AxiosError, undefined>(
    () =>
      axios
        .delete<useCartTruncateMutationRes>(`/cart`, {
          params: {
            tempUserId: getCartKey(),
          },
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Cart');
      },
    },
  );
};

export type CartItemOptionQuantityFrontDto = CartItemOptionQuantityDto & {
  optionId: Customer['id'];
};
export type useCartOptionQuantityRes = CartItemOption;
/** 장바구니 상품 옵션 개수 추가 제거 */
export const useCartOptionQuantity = (): UseMutationResult<
  useCartOptionQuantityRes,
  AxiosError,
  CartItemOptionQuantityFrontDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCartOptionQuantityRes,
    AxiosError,
    CartItemOptionQuantityFrontDto
  >(
    (dto) =>
      axios
        .patch<useCartOptionQuantityRes>(`/cart/option/${dto.optionId}`, dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Cart');
      },
    },
  );
};

export type useCartMutationRes = CartItem;
/** 장바구니 상품 추가 */
export const useCartMutation = (): UseMutationResult<
  useCartMutationRes,
  AxiosError,
  CartItemDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useCartMutationRes, AxiosError, CartItemDto>(
    (dto: CartItemDto) =>
      axios
        .post<useCartMutationRes>('/cart', { ...dto, tempUserId: getCartKey() })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Cart');
      },
    },
  );
};

export type useCartMigrationMutationRes = number;
/** 장바구니 temp -> 유저 연결 */
export const useCartMigrationMutation = (): UseMutationResult<
  useCartMigrationMutationRes,
  AxiosError,
  Pick<CartMigrationDto, 'customerId'>
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCartMigrationMutationRes,
    AxiosError,
    Pick<CartMigrationDto, 'customerId'>
  >(
    (dto: Pick<CartMigrationDto, 'customerId'>) =>
      axios
        .post<useCartMigrationMutationRes>('/cart/migration', {
          ...dto,
          tempUserId: getCartKey(),
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Cart');
      },
    },
  );
};

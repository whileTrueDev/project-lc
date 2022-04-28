import { CartItem, CartItemOption, Customer } from '@prisma/client';
import { CartItemDto, CartItemOptionQuantityDto } from '@project-lc/shared-types';
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
  Customer['id']
> => {
  const queryClient = useQueryClient();
  return useMutation<useCartTruncateMutationRes, AxiosError, Customer['id']>(
    (customerId: Customer['id']) =>
      axios
        .delete<useCartTruncateMutationRes>(`/cart`, {
          params: {
            customerId,
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
      axios.post<useCartMutationRes>('/cart', dto).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Cart');
      },
    },
  );
};

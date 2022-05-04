import { nanoid } from 'nanoid';

export const CART_TEMP_USER_ID_KEY = 'C_T_ID';
/** 장바구니 유저 식별 키를 반환. 없으면 생성해서 반환 */
export const getCartKey = (): string => {
  const key = window.localStorage.getItem(CART_TEMP_USER_ID_KEY);
  if (key) return key;
  const newKey = nanoid();
  window.localStorage.setItem(CART_TEMP_USER_ID_KEY, newKey);
  return newKey;
};

/** 장바구니 유저 식별 키를 제거 */
export const removeCartKey = (): boolean => {
  window.localStorage.setItem(CART_TEMP_USER_ID_KEY, '');
  return true;
};

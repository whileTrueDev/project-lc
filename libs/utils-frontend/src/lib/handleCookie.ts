import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name: string, value: string | number, options?: any): void => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name: string): any => {
  return cookies.get(name);
};

export const deleteCookie = (name: string): void => {
  return cookies.remove(name);
};

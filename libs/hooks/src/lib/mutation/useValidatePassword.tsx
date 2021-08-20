import { PasswordValidateDto } from '@project-lc/shared-types';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import axios from '../../axios';

export type useValidatePasswordRes = boolean;

export const isValidPassword = async (dto: PasswordValidateDto) => {
  const { data } = await axios.post<useValidatePasswordRes>(
    '/seller/validate-password',
    dto,
  );
  return data;
};
export const useValidatePassword = () => {
  return useMutation<boolean, AxiosError, PasswordValidateDto>(isValidPassword);
};

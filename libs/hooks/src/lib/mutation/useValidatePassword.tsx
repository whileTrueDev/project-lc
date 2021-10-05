import { PasswordValidateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export const isValidPassword = async (dto: PasswordValidateDto): Promise<boolean> => {
  const { data } = await axios.post<boolean>('/seller/validate-password', dto);
  return data;
};
export const useValidatePassword = (): UseMutationResult<
  boolean,
  AxiosError,
  PasswordValidateDto
> => {
  return useMutation<boolean, AxiosError, PasswordValidateDto>(isValidPassword);
};

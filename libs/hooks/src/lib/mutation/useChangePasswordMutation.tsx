import { PasswordValidateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useChangePasswordMutationDto = PasswordValidateDto;

export type useChangePasswordMutationRes = any;

export const changePassword = async (
  dto: useChangePasswordMutationDto,
): Promise<useChangePasswordMutationRes> => {
  const userType = process.env.NEXT_PUBLIC_APP_TYPE;
  const { data } = await axios.patch<useChangePasswordMutationRes>(
    `/${userType}/password`,
    dto,
  );
  return data;
};

export const useChangePasswordMutation = (): UseMutationResult<
  useChangePasswordMutationRes,
  AxiosError,
  useChangePasswordMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useChangePasswordMutationRes,
    AxiosError,
    useChangePasswordMutationDto
  >(changePassword, {
    onSuccess: () => {
      queryClient.invalidateQueries('Profile', { exact: true });
    },
  });
};

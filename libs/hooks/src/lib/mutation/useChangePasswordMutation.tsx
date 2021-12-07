import { PasswordValidateDto, UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useChangePasswordMutationDto = PasswordValidateDto;

export type useChangePasswordMutationRes = any;

export const changeSellerPassword = async (
  dto: useChangePasswordMutationDto,
): Promise<useChangePasswordMutationRes> => {
  const { data } = await axios.patch<useChangePasswordMutationRes>(
    '/seller/password',
    dto,
  );
  return data;
};

export const changeBroadcasterPassword = async (
  dto: useChangePasswordMutationDto,
): Promise<useChangePasswordMutationRes> => {
  const { data } = await axios.patch<useChangePasswordMutationRes>(
    '/broadcaster/password',
    dto,
  );
  return data;
};

export const useChangePasswordMutation = (
  userType: UserType,
): UseMutationResult<
  useChangePasswordMutationRes,
  AxiosError,
  useChangePasswordMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useChangePasswordMutationRes,
    AxiosError,
    useChangePasswordMutationDto
  >(userType === 'broadcaster' ? changeBroadcasterPassword : changeSellerPassword, {
    onSuccess: () => {
      queryClient.invalidateQueries('Profile', { exact: true });
    },
  });
};

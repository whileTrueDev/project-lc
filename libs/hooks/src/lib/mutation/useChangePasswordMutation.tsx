import { useMutation, useQuery, useQueryClient } from 'react-query';
import { PasswordValidateDto } from '@project-lc/shared-types';
import axios from '../../axios';

export type useChangePasswordMutationDto = PasswordValidateDto;

export type useChangePasswordMutationRes = any;

export const changePassword = async (dto: useChangePasswordMutationDto) => {
  const { data } = await axios.patch<useChangePasswordMutationRes>(
    '/seller/password',
    dto,
  );
  return data;
};

export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(changePassword, {
    onSuccess: () => {
      queryClient.invalidateQueries('Profile', { exact: true });
    },
  });
};

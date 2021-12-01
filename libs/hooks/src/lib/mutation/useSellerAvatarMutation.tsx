import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

/** 임시 아바타 업로드 뮤테이션 */
export const useSellerAvatarMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  FormData
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, FormData>(
    (dto: FormData) => axios.post<boolean>('/seller/avatar', dto).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Profile');
      },
    },
  );
};

export const useSellerAvatarRemoveMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  void
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, void>(
    () => axios.delete<boolean>('/seller/avatar').then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Profile');
      },
    },
  );
};

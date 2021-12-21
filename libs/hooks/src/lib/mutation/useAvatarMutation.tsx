import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

/** 임시 아바타 업로드 뮤테이션 */
export const useAvatarMutation = (): UseMutationResult<boolean, AxiosError, FormData> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, FormData>(
    (dto: FormData) => {
      const userType = process.env.NEXT_PUBLIC_APP_TYPE;
      return axios.post<boolean>(`/${userType}/avatar`, dto).then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Profile');
      },
    },
  );
};

export const useAvatarRemoveMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  void
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, void>(
    () => {
      const userType = process.env.NEXT_PUBLIC_APP_TYPE;
      return axios.delete<boolean>(`/${userType}/avatar`).then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Profile');
      },
    },
  );
};

import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import {
  LiveShoppingRegistByAdminDto,
  LiveShoppingRegistDTO,
} from '@project-lc/shared-types';
import { LiveShopping } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

/** 판매자가 라이브쇼핑 요청 */
export const useCreateLiveShoppingMutation = (): UseMutationResult<
  LiveShopping,
  AxiosError,
  LiveShoppingRegistDTO
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (dto: LiveShoppingRegistDTO) => {
      return axios.post<LiveShopping>('/live-shoppings', dto).then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('LiveShoppingList', { refetchInactive: true });
      },
    },
  );
};

/** 관리자로 라이브쇼핑 생성 뮤테이션 */
export const useCreateLiveShoppingByAdminMutation = (): UseMutationResult<
  LiveShopping,
  AxiosError,
  LiveShoppingRegistByAdminDto
> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (dto: LiveShoppingRegistByAdminDto) => {
      return axios
        .post<LiveShopping>('/admin/live-shopping', dto)
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('AdminLiveShoppingList', { refetchInactive: true });
      },
    },
  );
};

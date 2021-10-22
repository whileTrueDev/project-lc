import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { LiveShopping } from '@prisma/client';
import { LiveShoppingDTO } from '@project-lc/shared-types';
import axios from '../../axios';

type LiveShoppingManage = Omit<
  LiveShoppingDTO,
  'streamId' | 'sellerId' | 'goods_id' | 'contactId' | 'requests'
>;

export const useUpdateLiveShoppingManageMutation = (): UseMutationResult<
  LiveShopping,
  AxiosError,
  LiveShoppingManage
> => {
  return useMutation((dto: LiveShoppingManage) =>
    axios.patch('/admin/live-shopping', dto).then((res) => res.data),
  );
};

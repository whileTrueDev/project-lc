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
  { dto: LiveShoppingManage; videoUrlExist?: boolean }
> => {
  return useMutation((data: { dto: LiveShoppingManage; videoUrlExist?: boolean }) =>
    axios
      .patch('/admin/live-shopping', { dto: data.dto, videoUrlExist: data.videoUrlExist })
      .then((res) => res.data),
  );
};

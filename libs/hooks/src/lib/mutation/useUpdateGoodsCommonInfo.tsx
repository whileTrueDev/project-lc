import { GoodsInfo } from '@prisma/client';
import { GoodsInfoDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useUpdateGoodsCommonInfoDto {
  id: number; // 공통정보 고유번호(id)
  dto: GoodsInfoDto; // 수정할 데이터
  onSuccess?: (updatedGoodsInfo: GoodsInfo) => void;
}
export type useUpdateGoodsCommonInfoRes = GoodsInfo;

/** 공통정보 수정 뮤테이션 훅 */
export const useUpdateGoodsCommonInfo = (): UseMutationResult<
  useUpdateGoodsCommonInfoRes,
  AxiosError,
  useUpdateGoodsCommonInfoDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useUpdateGoodsCommonInfoRes,
    AxiosError,
    useUpdateGoodsCommonInfoDto
  >(
    (dto: useUpdateGoodsCommonInfoDto) =>
      axios
        .patch<useUpdateGoodsCommonInfoRes>(`goods/common-info/${dto.id}`, dto.dto)
        .then((res) => res.data),
    {
      onSuccess: (data, { onSuccess }) => {
        queryClient.invalidateQueries('GoodsCommonInfoList');
        if (onSuccess) {
          onSuccess(data);
        }
      },
    },
  );
};

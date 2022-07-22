import { MileageSetting } from '@prisma/client';
import { MileageSettingUpdateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useAdminMileageSettingMutationDto extends MileageSettingUpdateDto {
  id: number;
}

/** 관리자 마일리지세팅 수정 뮤테이션 */
export const useAdminMileageSettingUpdateMutation = (): UseMutationResult<
  MileageSetting,
  AxiosError,
  useAdminMileageSettingMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<MileageSetting, AxiosError, useAdminMileageSettingMutationDto>(
    (dto: useAdminMileageSettingMutationDto) =>
      axios
        .patch<MileageSetting>(`/mileage-setting/${dto.id}`, {
          defaultMileagePercent: dto.defaultMileagePercent,
          mileageStrategy: dto.mileageStrategy,
        })
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminMileageSetting');
      },
    },
  );
};

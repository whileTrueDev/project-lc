import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useLiveShoppingStateBoardAlertDeleteMutationDto {
  liveShoppingId: number;
}
export type useLiveShoppingStateBoardAlertDeleteMutationRes = boolean;

export const useLiveShoppingStateBoardAlertDeleteMutation = (): UseMutationResult<
  useLiveShoppingStateBoardAlertDeleteMutationRes,
  AxiosError,
  useLiveShoppingStateBoardAlertDeleteMutationDto
> => {
  // useLiveShoppingStateBoardAdminAlert 에서 refetchInactive로 계속 요청하여 데이터 갱신하고 있으므로 invalidate 하지 않았음
  return useMutation<
    useLiveShoppingStateBoardAlertDeleteMutationRes,
    AxiosError,
    useLiveShoppingStateBoardAlertDeleteMutationDto
  >((dto: useLiveShoppingStateBoardAlertDeleteMutationDto) =>
    axios
      .delete<useLiveShoppingStateBoardAlertDeleteMutationRes>(
        '/live-shoppings/current-state-admin-alert',
        {
          data: { liveShoppingId: dto.liveShoppingId },
        },
      )
      .then((res) => res.data),
  );
};

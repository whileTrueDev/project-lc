import { Export } from '@prisma/client';
import { DeliveryDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useDelieveryMutationRes = Export;
/** 배송중처리 요청 */
export const useDelieveryStartMutation = (): UseMutationResult<
  useDelieveryMutationRes,
  AxiosError,
  DeliveryDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useDelieveryMutationRes, AxiosError, DeliveryDto>(
    (dto: DeliveryDto) =>
      axios.post<useDelieveryMutationRes>('/delivery/start', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['Exports']);
      },
    },
  );
};

/** 배송완료처리 요청 */
export const useDelieveryDoneMutation = (): UseMutationResult<
  useDelieveryMutationRes,
  AxiosError,
  DeliveryDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useDelieveryMutationRes, AxiosError, DeliveryDto>(
    (dto: DeliveryDto) =>
      axios.post<useDelieveryMutationRes>('/delivery/done', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['Exports']);
      },
    },
  );
};

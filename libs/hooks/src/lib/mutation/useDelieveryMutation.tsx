import { Export } from '@prisma/client';
import { DeliveryDto, DeliveryManyDto } from '@project-lc/shared-types';
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
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('getAdminOrder', { refetchInactive: true });
        queryClient.invalidateQueries('AdminOrderList', { refetchInactive: true });
        queryClient.invalidateQueries('Exports');
        queryClient.invalidateQueries(['Exports'], { refetchInactive: true });
      },
    },
  );
};

export type useDelieveryMutationManyRes = Export[];
/** 배송중처리 - 일괄처리 요청 */
export const useDelieveryStartManyMutation = (): UseMutationResult<
  useDelieveryMutationManyRes,
  AxiosError,
  DeliveryManyDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useDelieveryMutationManyRes, AxiosError, DeliveryManyDto>(
    (dto: DeliveryManyDto) =>
      axios
        .post<useDelieveryMutationManyRes>('/delivery/start/many', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('getAdminOrder', { refetchInactive: true });
        queryClient.invalidateQueries('AdminOrderList', { refetchInactive: true });
        queryClient.invalidateQueries('Exports');
        queryClient.invalidateQueries(['Exports'], { refetchInactive: true });
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
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('getAdminOrder', { refetchInactive: true });
        queryClient.invalidateQueries('AdminOrderList', { refetchInactive: true });
        queryClient.invalidateQueries('Exports');
        queryClient.invalidateQueries(['Exports'], { refetchInactive: true });
      },
    },
  );
};

export type useDelieveryDoneManyRes = Export[];
/** 배송완료처리 - 일괄처리 요청 */
export const useDelieveryDoneManyMutation = (): UseMutationResult<
  useDelieveryDoneManyRes,
  AxiosError,
  DeliveryManyDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useDelieveryDoneManyRes, AxiosError, DeliveryManyDto>(
    (dto: DeliveryManyDto) =>
      axios
        .post<useDelieveryDoneManyRes>('/delivery/done/many', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('getAdminOrder', { refetchInactive: true });
        queryClient.invalidateQueries('AdminOrderList', { refetchInactive: true });
        queryClient.invalidateQueries('Exports');
        queryClient.invalidateQueries(['Exports'], { refetchInactive: true });
      },
    },
  );
};

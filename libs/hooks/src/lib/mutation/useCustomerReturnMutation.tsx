import {
  CreateReturnDto,
  CreateReturnRes,
  DeleteReturnRes,
  UpdateReturnDto,
  UpdateReturnRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';
import { CUSTOMER_RETURN_LIST_QUERY_KEY } from '../queries/useReturn';

/** 반품요청 생성 훅 */
export const useCustomerReturnMutation = (): UseMutationResult<
  CreateReturnRes,
  AxiosError,
  CreateReturnDto
> => {
  const queryClient = useQueryClient();
  return useMutation<CreateReturnRes, AxiosError, CreateReturnDto>(
    (dto: CreateReturnDto) =>
      axios.post<CreateReturnRes>('/return', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
        queryClient.invalidateQueries(CUSTOMER_RETURN_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
      },
    },
  );
};

/** 반품요청 삭제 훅 */
export const useDeleteCustomerReturn = (): UseMutationResult<
  DeleteReturnRes,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<DeleteReturnRes, AxiosError, number>(
    (returnId: number) =>
      axios.delete<DeleteReturnRes>(`/return/${returnId}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
        queryClient.invalidateQueries(CUSTOMER_RETURN_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
      },
    },
  );
};

export type ReturnMutationDto = {
  returnId: number;
  dto: UpdateReturnDto;
};
/** 크크쇼 db 반품 업데이트 훅 */
export const useUpdateReturnMutation = (): UseMutationResult<
  UpdateReturnRes,
  AxiosError,
  ReturnMutationDto
> => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ returnId, dto }: ReturnMutationDto) => {
      return axios.patch(`/return/${returnId}`, dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('customerReturnDetail');
        queryClient.invalidateQueries('AdminReturnList');
        queryClient.invalidateQueries('AdminSidebarNotiCounts', {
          refetchInactive: true,
        });
      },
    },
  );
};

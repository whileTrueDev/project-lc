import { CreateReturnRes, CreateReturnDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

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
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
      },
    },
  );
};

import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useDeleteShippingGroupDto = { groupId: number };
export type useDeleteShippingGroupRes = boolean;

export const useDeleteShippingGroup = (): UseMutationResult<
  boolean,
  AxiosError,
  useDeleteShippingGroupDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, useDeleteShippingGroupDto>(
    (dto: useDeleteShippingGroupDto) =>
      axios
        .delete<useDeleteShippingGroupRes>('/shipping-group', { data: dto })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ShippingGroupList');
      },
    },
  );
};

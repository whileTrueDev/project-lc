import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useDeleteShippingGroupDto = { groupId: number };
export type useDeleteShippingGroupRes = any;

export const useDeleteShippingGroup = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: useDeleteShippingGroupDto) =>
      axios.delete<useDeleteShippingGroupRes>('/shipping-group', { data: dto }),
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries('ShippingGroupList');
      },
    },
  );
};

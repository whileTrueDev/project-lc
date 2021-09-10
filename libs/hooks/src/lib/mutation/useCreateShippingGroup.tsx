import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCreateShippingGroupDto = Record<string, any>;
export type useCreateShippingGroupRes = any;

export const useCreateShippingGroup = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: useCreateShippingGroupDto) =>
      axios.post<useCreateShippingGroupRes>('/shipping-group', dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ShippingGroupList');
      },
    },
  );
};

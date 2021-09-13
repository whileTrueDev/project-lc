import { Seller, ShippingGroup } from '@prisma/client';
import { ShippingGroupDto } from '@project-lc/shared-types';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCreateShippingGroupDto = ShippingGroupDto;
export type useCreateShippingGroupRes = ShippingGroup & {
  seller: Seller;
};

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

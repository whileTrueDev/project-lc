import { Seller, SellerContacts } from '@prisma/client';
import { ShippingGroupDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCreateShippingGroupDto = ShippingGroupDto;
export type useCreateShippingGroupRes = SellerContacts;

export const useCreateShippingGroup = (): UseMutationResult<
  useCreateShippingGroupRes,
  AxiosError,
  useCreateShippingGroupDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useCreateShippingGroupRes, AxiosError, useCreateShippingGroupDto>(
    (dto: useCreateShippingGroupDto) =>
      axios
        .post<useCreateShippingGroupRes>('/shipping-group', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ShippingGroupList');
      },
    },
  );
};

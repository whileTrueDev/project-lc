import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { ShippingGroup, ShippingSet, ShippingOption, ShippingCost } from '.prisma/client';
import axios from '../../axios';

export type ShippingGroupItem = ShippingGroup & {
  shippingSets: (ShippingSet & {
    shippingOptions: (ShippingOption & {
      shippingCost: ShippingCost[];
    })[];
  })[];
};

export const getShippingGroupItem = async (
  groupId: number | null,
): Promise<ShippingGroupItem> => {
  return axios
    .get<ShippingGroupItem>(`/shipping-group/${groupId}`)
    .then((res) => res.data);
};

export const useShippingGroupItem = (
  groupId: number | null,
): UseQueryResult<ShippingGroupItem, AxiosError> => {
  return useQuery<ShippingGroupItem, AxiosError>(
    ['ShippingGroupItem', groupId],
    () => getShippingGroupItem(groupId),
    {
      enabled: !!groupId,
    },
  );
};

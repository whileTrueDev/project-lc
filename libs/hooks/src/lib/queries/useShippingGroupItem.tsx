import { useQuery } from 'react-query';
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

export const useShippingGroupItem = (groupId: number | null) => {
  return useQuery<ShippingGroupItem>(
    ['ShippingGroupItem', groupId],
    () => getShippingGroupItem(groupId),
    {
      enabled: !!groupId,
    },
  );
};

import { useQuery } from 'react-query';
import { ShippingGroup } from '.prisma/client';
import axios from '../../axios';

export type ShippingGroupList = ShippingGroup[];

export const getShippingGroupList = async (): Promise<ShippingGroupList> => {
  return axios.get<ShippingGroupList>('/shipping-group').then((res) => res.data);
};

export const useShippingGroupList = (sellerEmail: string, enabled: boolean) => {
  return useQuery<ShippingGroupList>(
    ['ShippingGroupList', sellerEmail],
    getShippingGroupList,
    {
      enabled,
    },
  );
};

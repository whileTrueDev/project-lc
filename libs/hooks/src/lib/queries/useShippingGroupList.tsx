import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { ShippingGroup } from '.prisma/client';
import axios from '../../axios';

export type ShippingGroupListItemType = ShippingGroup & {
  _count: {
    goods: number;
  };
};

export type ShippingGroupList = ShippingGroupListItemType[];

export const getShippingGroupList = async (): Promise<ShippingGroupList> => {
  return axios.get<ShippingGroupList>('/shipping-group').then((res) => res.data);
};

export const useShippingGroupList = (
  sellerId: number,
  enabled: boolean,
): UseQueryResult<ShippingGroupList, AxiosError> => {
  return useQuery<ShippingGroupList, AxiosError>(
    ['ShippingGroupList', sellerId],
    getShippingGroupList,
    {
      enabled,
    },
  );
};

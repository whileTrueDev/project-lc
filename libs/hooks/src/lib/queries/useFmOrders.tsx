import { useQuery } from 'react-query';
import { FmOrder } from '@project-lc/shared-types';
import axios from '../../axios';

export const getFmOrders = async (): Promise<FmOrder[]> => {
  return axios.get<FmOrder[]>('/fm-orders').then((res) => res.data);
};

export const useFmOrders = (initialData: FmOrder[]) => {
  return useQuery<FmOrder[]>('FmOrders', getFmOrders, {
    initialData,
  });
};

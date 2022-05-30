import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getKkshowOrder = async (orderId: string): Promise<any> => {
  return axios.get<any>(`/order/${orderId}`).then((res) => res.data);
};

export const useKkshowOrder = (orderId: string): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(
    ['getKkshowOrder', orderId],
    () => getKkshowOrder(orderId),
    {
      enabled: !!orderId,
    },
  );
};

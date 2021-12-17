import { Seller, SellerShop } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

type AdminSellerList = (Omit<Seller, 'password'> & { sellerShop: SellerShop })[];

export const getAdminSellerList = async (): Promise<AdminSellerList> => {
  return axios.get<AdminSellerList>('/admin/sellers').then((res) => res.data);
};

export const useAdminSellerList = (): UseQueryResult<AdminSellerList, AxiosError> => {
  return useQuery<AdminSellerList, AxiosError>('AdminSellerList', getAdminSellerList);
};

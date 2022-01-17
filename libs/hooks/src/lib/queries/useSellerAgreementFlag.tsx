import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { Seller } from '.prisma/client';
import axios from '../../axios';

export const getSellerAgreementFlag = async (
  sellerEmail?: Seller['email'],
): Promise<boolean> => {
  return axios
    .get<boolean>(`/seller/agreement`, { params: { sellerEmail } })
    .then((res) => res.data);
};

export const useSellerAgreementFlag = (
  sellerEmail?: Seller['email'],
): UseQueryResult<boolean, AxiosError> => {
  const queryKey = ['SellerAgreementFlag'];
  return useQuery<boolean, AxiosError>(queryKey, () =>
    getSellerAgreementFlag(sellerEmail),
  );
};

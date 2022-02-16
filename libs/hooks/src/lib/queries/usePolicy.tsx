import { Policy } from '@prisma/client';
import { GetPolicyDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getPolicy = async (dto: GetPolicyDto): Promise<Policy> => {
  return axios.get<Policy>('/policy', { params: dto }).then((res) => res.data);
};

export const usePolicy = (
  dto: GetPolicyDto,
  initialData?: Policy,
): UseQueryResult<Policy, AxiosError> => {
  return useQuery<Policy, AxiosError>(['Policy', dto], () => getPolicy(dto), {
    initialData,
  });
};

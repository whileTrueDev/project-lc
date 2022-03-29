import { Manual, UserType } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getManualList = async (target: UserType): Promise<Manual[]> => {
  return axios
    .get<Manual[]>('/manual/list', { params: { target } })
    .then((res) => res.data);
};
export const useManualList = (target: UserType): UseQueryResult<Manual[], AxiosError> => {
  return useQuery<Manual[], AxiosError>(
    ['ManualList', target],
    () => getManualList(target),
    {
      enabled: !!target,
    },
  );
};

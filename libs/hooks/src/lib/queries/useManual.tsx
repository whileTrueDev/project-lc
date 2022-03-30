import { Manual, UserType } from '@prisma/client';
import { ManualListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getManualList = async (target: UserType): Promise<ManualListRes> => {
  return axios
    .get<ManualListRes>('/manual/list', { params: { target } })
    .then((res) => res.data);
};
export const useManualList = (
  target: UserType,
): UseQueryResult<ManualListRes, AxiosError> => {
  return useQuery<ManualListRes, AxiosError>(
    ['ManualList', target],
    () => getManualList(target),
    {
      enabled: !!target,
    },
  );
};

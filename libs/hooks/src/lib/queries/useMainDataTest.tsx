import { KkshowMainRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

// TODO 테스트용. 삭제 필요 by hwasurr
export const mainDataTestQueryKey = 'MainDataTest';
export const getMainDataTest = async (): Promise<KkshowMainRes> => {
  return axios.get<KkshowMainRes>('/main-data').then((res) => res.data);
};

export const useMainDataTest = (): UseQueryResult<KkshowMainRes, AxiosError> => {
  return useQuery<KkshowMainRes, AxiosError>(mainDataTestQueryKey, getMainDataTest, {});
};

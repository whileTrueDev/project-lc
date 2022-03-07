import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export interface MainDataTest {
  avatar: string;
}

// TODO 테스트용. 삭제 필요 by hwasurr
export const mainDataTestQueryKey = 'MainDataTest';
export const getMainDataTest = async (): Promise<MainDataTest> => {
  return axios.get<MainDataTest>('/main-data').then((res) => res.data);
};

export const useMainDataTest = (): UseQueryResult<MainDataTest, AxiosError> => {
  return useQuery<MainDataTest, AxiosError>(mainDataTestQueryKey, getMainDataTest, {});
};

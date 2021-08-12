import { useQuery } from 'react-query';
import axios from '../../axios';

export interface Test {
  _field: 'default field';
}

export const getTest = async (): Promise<Test> => {
  return axios.get<Test>('/').then((res) => res.data);
};

export const useTest = (initialData: Test) => {
  return useQuery<Test>('Test', getTest, {
    initialData,
  });
};

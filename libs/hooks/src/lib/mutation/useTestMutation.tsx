import { useMutation } from 'react-query';
import axios from '../../axios';

export interface useTestMutationDto {
  _field: 'default field';
}
type useTestMutationRes = boolean;

export const useTestMutation = () => {
  return useMutation((dto: useTestMutationDto) =>
    axios.post<useTestMutationRes>('/', dto),
  );
};

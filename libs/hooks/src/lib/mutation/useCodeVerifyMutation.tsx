import { useMutation } from 'react-query';
import axios from '../../axios';

export interface useCodeVerifyMutationDto {
  email: string;
  code: string;
}
export type useCodeVerifyMutationRes = boolean;

export const useCodeVerifyMutation = () => {
  return useMutation((dto: useCodeVerifyMutationDto) =>
    axios.post<useCodeVerifyMutationRes>('/auth/code-verification', dto),
  );
};

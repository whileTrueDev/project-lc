import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useDeleteBroadcasterMutationRes = boolean;
export type DeleteBroadcasterDto = {
  email: string;
};

export const useDeleteBroadcasterMutation = (): UseMutationResult<
  useDeleteBroadcasterMutationRes,
  AxiosError,
  DeleteBroadcasterDto
> => {
  return useMutation<useDeleteBroadcasterMutationRes, AxiosError, DeleteBroadcasterDto>(
    (dto: DeleteBroadcasterDto) =>
      axios
        .delete<useDeleteBroadcasterMutationRes>('/broadcaster', { data: dto })
        .then((res) => res.data),
  );
};

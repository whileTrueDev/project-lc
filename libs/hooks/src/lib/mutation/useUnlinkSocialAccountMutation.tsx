import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface useUnlinkSocialAccountMutationDto {
  provider: string;
  serviceId: string;
}
export type useUnlinkSocialAccountMutationRes = boolean;

export const unlinkSocialAccount = async ({
  provider,
  serviceId,
}: useUnlinkSocialAccountMutationDto): Promise<any> => {
  const { data } = await axios.delete(`/social/${provider}/unlink/${serviceId}`);
  return data;
};

export const useUnlinkSocialAccountMutation = (): UseMutationResult<
  any,
  AxiosError,
  useUnlinkSocialAccountMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, useUnlinkSocialAccountMutationDto>(
    unlinkSocialAccount,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SocialAccounts');
      },
    },
  );
};

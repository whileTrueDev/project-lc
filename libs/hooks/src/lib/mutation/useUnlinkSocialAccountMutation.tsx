import { UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface useUnlinkSocialAccountMutationDto {
  userType: UserType;
  provider: string;
  serviceId: string;
}
export type useUnlinkSocialAccountMutationRes = boolean;

export const unlinkSocialAccount = async ({
  userType,
  provider,
  serviceId,
}: useUnlinkSocialAccountMutationDto): Promise<any> => {
  const { data } = await axios.delete(`/social/${provider}/unlink/${serviceId}`, {
    data: { userType },
  });
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

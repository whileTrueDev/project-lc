import { unlink } from 'node:fs/promises';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface useUnlinkSocialAccountMutationDto {
  provider: string;
  serviceId: string;
}
export type useUnlinkSocialAccountMutationRes = boolean;

export const unlinkSocialAccount = async ({
  provider,
  serviceId,
}: useUnlinkSocialAccountMutationDto) => {
  const { data } = await axios.delete(`/social/${provider}/unlink/${serviceId}`);
  return data;
};

export const useUnlinkSocialAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(unlinkSocialAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries('SocialAccounts');
    },
  });
};

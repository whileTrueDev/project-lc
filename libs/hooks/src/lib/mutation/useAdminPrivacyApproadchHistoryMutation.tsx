import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import {
  PrivacyApproachHistory,
  PrivacyApproachHistoryActionType,
  PrivacyApproachHistoryInfoType,
} from '@prisma/client';
import axios from '../../axios';

export type CreateAdminPrivacyApproachHistoryType = {
  infoType: PrivacyApproachHistoryInfoType;
  actionType: PrivacyApproachHistoryActionType;
};

export const useAdminPrivacyApproachHistoryMutation = (): UseMutationResult<
  PrivacyApproachHistory,
  AxiosError,
  CreateAdminPrivacyApproachHistoryType
> => {
  return useMutation<
    PrivacyApproachHistory,
    AxiosError,
    CreateAdminPrivacyApproachHistoryType
  >((dto: CreateAdminPrivacyApproachHistoryType) =>
    axios
      .post<PrivacyApproachHistory>('/admin/privacy-approach-history', dto)
      .then((res) => res.data),
  );
};

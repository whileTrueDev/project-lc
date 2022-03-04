import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { PrivacyApproachHistory } from '@prisma/client';
import { PrivacyApproachHistoryDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useAdminPrivacyApproachHistoryMutation = (): UseMutationResult<
  PrivacyApproachHistory,
  AxiosError,
  PrivacyApproachHistoryDto
> => {
  return useMutation<PrivacyApproachHistory, AxiosError, PrivacyApproachHistoryDto>(
    (dto: PrivacyApproachHistoryDto) =>
      axios
        .post<PrivacyApproachHistory>('/admin/privacy-approach-history', dto)
        .then((res) => res.data),
  );
};

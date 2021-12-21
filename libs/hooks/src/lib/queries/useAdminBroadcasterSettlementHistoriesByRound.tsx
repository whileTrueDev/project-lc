import { FindBcSettlementHistoriesRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminBroadcasterSettlementHistories =
  async (): Promise<FindBcSettlementHistoriesRes> => {
    return axios
      .get<FindBcSettlementHistoriesRes>('/admin/settlement-history/broadcaster', {})
      .then((res) => res.data);
  };

export const useAdminBroadcasterSettlementHistories = (): UseQueryResult<
  FindBcSettlementHistoriesRes,
  AxiosError
> => {
  return useQuery<FindBcSettlementHistoriesRes, AxiosError>(
    'AdminBroadcasterSettlementHistories',
    () => getAdminBroadcasterSettlementHistories(),
  );
};

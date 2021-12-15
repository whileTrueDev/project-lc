import { AdminBroadcasterSettlementInfoList } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminBroadcasterSettlementInfoList =
  async (): Promise<AdminBroadcasterSettlementInfoList> => {
    return axios
      .get<AdminBroadcasterSettlementInfoList>('/admin/settelment-info-list/broadcaster')
      .then((res) => res.data);
  };

export const useAdminBroadcasterSettlementInfoList = (): UseQueryResult<
  AdminBroadcasterSettlementInfoList,
  AxiosError
> => {
  return useQuery<AdminBroadcasterSettlementInfoList, AxiosError>(
    'AdminBroadcasterSettlementInfoList',
    getAdminBroadcasterSettlementInfoList,
  );
};

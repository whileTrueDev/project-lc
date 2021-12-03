import { BroadcasterRes, FindBroadcasterDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcaster = async (
  dto: FindBroadcasterDto,
): Promise<BroadcasterRes | null> => {
  return axios
    .get<BroadcasterRes | null>('/broadcaster', { params: dto })
    .then((res) => res.data);
};

export const useBroadcaster = (
  dto: FindBroadcasterDto,
): UseQueryResult<BroadcasterRes | null, AxiosError> => {
  return useQuery<BroadcasterRes | null, AxiosError>(
    ['Broadcaster', dto.id, dto.email],
    () => getBroadcaster(dto),
  );
};

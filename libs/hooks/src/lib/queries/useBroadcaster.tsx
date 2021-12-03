import { FindBroadcasterDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { Broadcaster } from '.prisma/client';
import axios from '../../axios';

type BroadcasterRes = Broadcaster | null;
export const getBroadcaster = async (
  dto: FindBroadcasterDto,
): Promise<BroadcasterRes> => {
  return axios.get<Broadcaster>('/broadcaster', { params: dto }).then((res) => res.data);
};

export const useBroadcaster = (
  dto: FindBroadcasterDto,
): UseQueryResult<BroadcasterRes, AxiosError> => {
  return useQuery<BroadcasterRes, AxiosError>(['Broadcaster', dto.id, dto.email], () =>
    getBroadcaster(dto),
  );
};

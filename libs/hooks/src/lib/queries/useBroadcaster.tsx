import {
  BroadcasterRes,
  FindBroadcasterDto,
  BroadcasterOnlyNickNameAndAvatar,
} from '@project-lc/shared-types';
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
    { enabled: !!(dto.id || dto.email) },
  );
};

export const getBroadcasterGiftDisplay = async (
  id?: number,
): Promise<BroadcasterOnlyNickNameAndAvatar> => {
  return axios
    .get<BroadcasterOnlyNickNameAndAvatar>('/broadcaster/gift/display', {
      params: { id },
    })
    .then((res) => res.data);
};

export const useBroadcasterGiftDisplay = (
  id?: number,
): UseQueryResult<BroadcasterOnlyNickNameAndAvatar, AxiosError> => {
  return useQuery<BroadcasterOnlyNickNameAndAvatar, AxiosError>(
    ['getBroadcasterGiftDisplay', id],
    () => getBroadcasterGiftDisplay(id),
    { enabled: !!id },
  );
};

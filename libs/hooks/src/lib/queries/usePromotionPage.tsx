import { Broadcaster, BroadcasterPromotionPage } from '@prisma/client';
import {
  FindManyDto,
  GetRankingDto,
  GetRankingRes,
  PromotionPagePromotionGoodsRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import axios from '../../axios';

export const getPromotionPage = async (
  broadcasterId?: Broadcaster['id'],
): Promise<BroadcasterPromotionPage> => {
  return axios
    .get<BroadcasterPromotionPage>(`/broadcaster/${broadcasterId}/promotion-page`)
    .then((res) => res.data);
};

export const usePromotionPage = (
  broadcasterId?: Broadcaster['id'] | string,
): UseQueryResult<BroadcasterPromotionPage, AxiosError> => {
  const bcId = Number(broadcasterId);
  return useQuery<BroadcasterPromotionPage, AxiosError>(
    ['PromotionPage', broadcasterId],
    () => getPromotionPage(bcId),
    {
      enabled: !!bcId,
    },
  );
};

export const getPromotionPageGoods = async (
  broadcasterId?: Broadcaster['id'],
  dto?: FindManyDto,
): Promise<PromotionPagePromotionGoodsRes> => {
  return axios
    .get<PromotionPagePromotionGoodsRes>(
      `/broadcaster/${broadcasterId}/promotion-page/goods`,
      {
        params: dto,
      },
    )
    .then((res) => res.data);
};

export const usePromotionPageGoods = (
  broadcasterId?: Broadcaster['id'] | string,
  dto?: FindManyDto,
): UseInfiniteQueryResult<PromotionPagePromotionGoodsRes, AxiosError> => {
  const bcId = Number(broadcasterId);
  return useInfiniteQuery<PromotionPagePromotionGoodsRes, AxiosError>(
    ['PromotionPageGoods', broadcasterId, dto],
    ({ pageParam = 0 }) => getPromotionPageGoods(bcId, { ...dto, skip: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
      enabled: !!bcId,
    },
  );
};

export const getPromotionPageRanking = async (
  broadcasterId?: Broadcaster['id'],
  dto?: GetRankingDto,
): Promise<GetRankingRes> => {
  return axios
    .get(`/broadcaster/${broadcasterId}/promotion-page/ranking`, { params: dto })
    .then((res) => res.data);
};

export const usePromotionPageRanking = (
  broadcasterId?: Broadcaster['id'],
  dto?: GetRankingDto,
): UseQueryResult<GetRankingRes, AxiosError> => {
  const bcId = Number(broadcasterId);
  return useQuery<GetRankingRes, AxiosError>(
    ['PromotionPageRanking', broadcasterId, dto],
    () => getPromotionPageRanking(bcId, dto),
    { enabled: !!broadcasterId },
  );
};

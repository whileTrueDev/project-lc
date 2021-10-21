import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { FindFmOrdersDto, FindFmOrderRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrdersDuringLiveShoppingSales = async (dto: any): Promise<any> => {
  return axios
    .get<any>('/fm-orders/per-live-shopping', {
      params: {
        perLiveShopping: dto.goodsIdList,
      },
    })
    .then((res) => res.data);
};

export const useFmOrdersDuringLiveShoppingSales = (
  dto: any,
  options?: UseQueryOptions<any, AxiosError>,
): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(
    ['FmOrdersDuringLiveShoppingSales', dto],
    () => getFmOrdersDuringLiveShoppingSales(dto),
    options,
  );
};

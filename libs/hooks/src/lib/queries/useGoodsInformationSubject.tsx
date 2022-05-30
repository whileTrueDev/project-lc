import { GoodsInformationSubject } from '@prisma/client';
import { GoodsInformationSubjectRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export const getGoodsInformationSubject = async (): Promise<
  GoodsInformationSubjectRes[]
> => {
  const url = '/goods-information-subject';
  return axios.get<GoodsInformationSubjectRes[]>(url).then((res) => res.data);
};
/** 상품 품목 (정보제공고시 템플릿) 목록 조회 */
export const useGoodsInformationSubject = (
  options?: UseQueryOptions<GoodsInformationSubjectRes[], AxiosError>,
): UseQueryResult<GoodsInformationSubjectRes[], AxiosError> => {
  return useQuery<GoodsInformationSubjectRes[], AxiosError>(
    'GoodsInformationSubject',
    getGoodsInformationSubject,
    { ...options },
  );
};

export const getGoodsInformationSubjectById = async (
  id?: GoodsInformationSubject['id'] | null,
): Promise<GoodsInformationSubjectRes> => {
  const url = '/goods-information-subject';
  return axios
    .get<GoodsInformationSubjectRes>(id ? `${url}/${id}` : url)
    .then((res) => res.data);
};
/** 상품 품목 (정보제공고시 템플릿) 개별 조회 */
export const useGoodsInformationSubjectById = (
  id?: GoodsInformationSubject['id'] | null,
  options?: UseQueryOptions<GoodsInformationSubjectRes, AxiosError>,
): UseQueryResult<GoodsInformationSubjectRes, AxiosError> => {
  return useQuery<GoodsInformationSubjectRes, AxiosError>(
    ['GoodsInformationSubject', id],
    () => getGoodsInformationSubjectById(id),
    { enabled: !!id, ...options },
  );
};

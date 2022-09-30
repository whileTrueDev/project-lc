import { KkshowShoppingSectionItem } from '@prisma/client';
import {
  GoodsCategoryWithFamily,
  KkshowShoppingTabResData,
  KkshowShoppingSectionsResData,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const kkshowShoppingQueryKey = 'KkshowShopping';
export const getKkshowShopping = async (): Promise<KkshowShoppingTabResData> => {
  const url =
    process.env.NEXT_PUBLIC_APP_TYPE === 'admin'
      ? '/admin/kkshow-shopping'
      : 'kkshow-shopping';
  return axios.get<KkshowShoppingTabResData>(url).then((res) => res.data);
};

export const useKkshowShopping = (): UseQueryResult<
  KkshowShoppingTabResData,
  AxiosError
> => {
  return useQuery<KkshowShoppingTabResData, AxiosError>(
    kkshowShoppingQueryKey,
    getKkshowShopping,
  );
};

// ----- 크크쇼 쇼핑탭에서 표시할 섹션데이터 조회(캐러셀 + 순서에 맞게 배열된 섹션목록)
export const kkshowShoppingSectionsQueryKey = 'KkshowShoppingSections';
export const getKkshowShoppingSectionsData =
  async (): Promise<KkshowShoppingSectionsResData> => {
    return axios
      .get<KkshowShoppingSectionsResData>('kkshow-shopping/sections')
      .then((res) => res.data);
  };

/** 크크쇼 쇼핑탭에서 표시할 섹션데이터 조회(캐러셀 + 순서에 맞게 배열된 섹션목록) */
export const useKkshowShoppingSections = (): UseQueryResult<
  KkshowShoppingSectionsResData,
  AxiosError
> => {
  return useQuery<KkshowShoppingSectionsResData, AxiosError>(
    kkshowShoppingSectionsQueryKey,
    getKkshowShoppingSectionsData,
  );
};

// ------ 관리자페이지에서 전체 섹션데이터 조회
export const getAdminKkshowShoppingSections = async (): Promise<
  KkshowShoppingSectionItem[]
> => {
  return axios
    .get<KkshowShoppingSectionItem[]>('/admin/kkshow-shopping/sections')
    .then((res) => res.data);
};

/** 관리자페이지에서 전체 섹션데이터 조회 */
export const useAdminKkshowShoppingSections = (): UseQueryResult<
  KkshowShoppingSectionItem[],
  AxiosError
> => {
  return useQuery<KkshowShoppingSectionItem[], AxiosError>(
    'AdminKkshowShoppingSections',
    getAdminKkshowShoppingSections,
  );
};

// 관리자페이지에서 섹션 순서 조회
export const getAdminShoppingSectionOrder = async (): Promise<number[]> => {
  return axios.get<number[]>('/admin/kkshow-shopping/order').then((res) => res.data);
};
export const useAdminShoppingSectionOrder = (): UseQueryResult<number[], AxiosError> => {
  return useQuery<number[], AxiosError>(
    'AdminShoppingSectionOrder',
    getAdminShoppingSectionOrder,
  );
};

// 크크마켓 전시 카테고리 목록 조회
export const kkshowShoppingCategoriesKey = 'KkshowShoppingCategories';
export const getKkshowShoppingCategories = async (): Promise<
  GoodsCategoryWithFamily[]
> => {
  return axios
    .get<GoodsCategoryWithFamily[]>('/kkshow-shopping/categories')
    .then((res) => res.data)
    .catch(() => []);
};
export const useKkshowShoppingCategories = (): UseQueryResult<
  GoodsCategoryWithFamily[],
  AxiosError
> => {
  return useQuery<GoodsCategoryWithFamily[], AxiosError>(
    kkshowShoppingCategoriesKey,
    getKkshowShoppingCategories,
  );
};

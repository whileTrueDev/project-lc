import { Manual, UserType } from '@prisma/client';
import { ManualListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 이용안내 목록조회(컨텐츠 포함 x) 훅 */
export const getManualList = async (target: UserType): Promise<ManualListRes> => {
  return axios
    .get<ManualListRes>('/manual/list', { params: { target } })
    .then((res) => res.data);
};
export const useManualList = (
  target: UserType,
): UseQueryResult<ManualListRes, AxiosError> => {
  return useQuery<ManualListRes, AxiosError>(
    ['ManualList', target],
    () => getManualList(target),
    {
      enabled: !!target,
    },
  );
};

/** 이용안내 1개 데이터 조회(컨텐츠 포함o) 훅 */
export const getManualDetail = async (id: number): Promise<Manual> => {
  return axios.get<Manual>('manual', { params: { id } }).then((res) => res.data);
};

export const useManualDetail = (id: number): UseQueryResult<Manual, AxiosError> => {
  return useQuery<Manual, AxiosError>(['ManualDetail', id], () => getManualDetail(id), {
    enabled: !!id,
  });
};

/** 페이지에 연결된 이용안내 id조회 훅
 * routerPath : 해당 페이지에서 router.pathName
 * userType: 해당 페이지의 appType
 */
export const getManualLinkPageId = async ({
  routerPath,
  userType,
}: {
  routerPath: string;
  userType: UserType;
}): Promise<number | null> => {
  return axios
    .get<number | null>('manual/id', { params: { routerPath, userType } })
    .then((res) => res.data);
};
export const useManualLinkPageId = ({
  routerPath,
  userType,
}: {
  routerPath: string;
  userType: UserType;
}): UseQueryResult<number | null, AxiosError> => {
  return useQuery<number | null, AxiosError>(
    ['ManualLinkPageId', { routerPath, userType }],
    () => getManualLinkPageId({ routerPath, userType }),
    {
      enabled: !!routerPath,
    },
  );
};

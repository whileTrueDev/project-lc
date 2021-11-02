import { useQuery, UseQueryResult } from 'react-query';
import { FmExport, FmExportRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmExport = async (
  exportCode?: FmExport['export_code'],
): Promise<FmExportRes> => {
  return axios.get<FmExportRes>(`/fm-exports/${exportCode}`).then((res) => res.data);
};

export const useFmExport = (
  exportCode?: FmExport['export_code'] | string,
  initialData?: FmExportRes,
): UseQueryResult<FmExportRes, AxiosError> => {
  return useQuery<FmExportRes, AxiosError>(
    ['FmExport', exportCode],
    () => getFmExport(exportCode),
    {
      initialData,
      enabled: !!exportCode,
      retry: false,
    },
  );
};

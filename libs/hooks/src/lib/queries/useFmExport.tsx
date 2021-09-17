import { useQuery } from 'react-query';
import { FmExport, FmExportRes } from '@project-lc/shared-types';
import axios from '../../axios';

export const getFmExport = async (
  exportCode?: FmExport['export_code'],
): Promise<FmExportRes> => {
  return axios.get<FmExportRes>(`/fm-exports/${exportCode}`).then((res) => res.data);
};

export const useFmExport = (
  exportCode?: FmExport['export_code'] | string,
  initialData?: FmExportRes,
) => {
  return useQuery<FmExportRes>(['FmExport', exportCode], () => getFmExport(exportCode), {
    initialData,
    enabled: !!exportCode,
    retry: false,
  });
};

import { ExportListRes, ExportRes, FindExportListDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getExports = async (dto: FindExportListDto): Promise<ExportListRes> => {
  return axios.get<ExportListRes>('/export', { params: dto }).then((res) => res.data);
};

export const useExports = (
  dto: FindExportListDto,
  options?: UseQueryOptions<ExportListRes, AxiosError>,
): UseQueryResult<ExportListRes, AxiosError> => {
  return useQuery<ExportListRes, AxiosError>('Exports', () => getExports(dto), {
    ...options,
  });
};

export const getExportByCode = async (exportCode: string): Promise<ExportRes> => {
  return axios.get<ExportRes>(`/export/${exportCode}`).then((res) => res.data);
};

export const useExportByCode = (
  exportCode: string,
  options?: UseQueryOptions<ExportRes, AxiosError>,
): UseQueryResult<ExportRes, AxiosError> => {
  return useQuery<ExportRes, AxiosError>(
    ['Exports', exportCode],
    () => getExportByCode(exportCode),
    {
      ...options,
    },
  );
};

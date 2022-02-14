import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getSettlementHistoryYears = async (): Promise<string[]> => {
  return axios.get<string[]>('/seller/settlement-history/years').then((res) => res.data);
};

export const useSettlementHistoryYears = (): UseQueryResult<string[], AxiosError> => {
  return useQuery<string[], AxiosError>(
    'SettlementHistoryYears',
    getSettlementHistoryYears,
  );
};

export const getSettlementHistoryMonths = async (dto: {
  year?: string;
}): Promise<string[]> => {
  return axios
    .get<string[]>('/seller/settlement-history/months', { params: { ...dto } })
    .then((res) => res.data);
};

export const useSettlementHistoryMonths = (dto: {
  year?: string;
}): UseQueryResult<string[], AxiosError> => {
  return useQuery<string[], AxiosError>(
    ['SettlementHistoryMonths', dto.year],
    () => getSettlementHistoryMonths(dto),
    {
      enabled: !!dto.year,
    },
  );
};

export const getSettlementHistoryRounds = async (dto: {
  year?: string;
  month?: string;
}): Promise<string[]> => {
  return axios
    .get<string[]>('/seller/settlement-history/rounds', { params: { ...dto } })
    .then((res) => res.data);
};

export const useSettlementHistoryRounds = (dto: {
  year?: string;
  month?: string;
}): UseQueryResult<string[], AxiosError> => {
  return useQuery<string[], AxiosError>(
    ['useSettlementHistoryRounds', dto.year, dto.month],
    () => getSettlementHistoryRounds(dto),
    {
      enabled: !!dto.year && !!dto.month,
    },
  );
};

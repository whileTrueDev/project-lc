import { FmExport } from '../res-types/fmExport.res';

export const fmExportConfirmStatuses: Record<FmExport['buy_confirm'], string> = {
  admin: '관리자',
  none: '',
  system: '자동',
  user: '구매자',
};

export const convertFmExportConfirmStatusToString = (
  key: FmExport['buy_confirm'],
): string => {
  return fmExportConfirmStatuses[key];
};

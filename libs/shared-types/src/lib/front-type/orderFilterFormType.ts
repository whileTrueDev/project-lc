export interface OrderFilterFormType {
  search: string;
  searchDateType: '주문일' | '입금일';
  searchStartDate: string | null; // this way is not supported https://github.com/react-hook-form/react-hook-form/issues/4704
  searchEndDate: string | null; // this way is not supported https://github.com/react-hook-form/react-hook-form/issues/4704
  searchStatuses: string[];
  searchExtendedStatuses: string[];
}

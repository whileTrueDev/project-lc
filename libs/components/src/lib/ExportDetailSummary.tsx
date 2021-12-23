import {
  convertFmDeliveryCompanyToString,
  convertFmExportConfirmStatusToString,
  FmExportRes,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { FaHamburger, FaBoxOpen, FaShippingFast, FaCalendarAlt } from 'react-icons/fa';
import { SummaryList } from './SummaryList';

export interface ExportDetailSummaryProps {
  exportData: FmExportRes;
}
export function ExportDetailSummary({
  exportData,
}: ExportDetailSummaryProps): JSX.Element {
  return (
    <SummaryList
      listItems={[
        {
          id: '출고등록일시',
          value: `출고 등록일시 ${dayjs(exportData.regist_date).format(
            'YYYY년 MM월 DD일 HH:mm:ss',
          )}`,
          icon: FaCalendarAlt,
        },
        {
          id: '출고 완료일',
          value: `출고 완료일 ${dayjs(exportData.complete_date).format(
            'YYYY년 MM월 DD일',
          )}`,
          icon: FaCalendarAlt,
          iconColor: 'cyan.600',
          disabled: !exportData.complete_date,
        },
        {
          id: '배송 완료일',
          value: `배송 완료일 ${dayjs(exportData.shipping_date).format(
            'YYYY년 MM월 DD일',
          )}`,
          icon: FaCalendarAlt,
          iconColor: 'blue.500',
          disabled: !exportData.shipping_date,
        },
        {
          id: '택배사',
          value: `택배사 ${convertFmDeliveryCompanyToString(
            exportData.delivery_company_code,
          )}`,
          icon: FaBoxOpen,
        },
        {
          id: '송장번호',
          value: `송장번호 ${exportData.delivery_number}`,
          icon: FaShippingFast,
        },
        {
          id: '출고 상품 개수',
          value: `출고 상품 개수 ${exportData.items.length} 개`,
          icon: FaHamburger,
        },
        {
          id: '구매확정',
          value: `구매확정 (${convertFmExportConfirmStatusToString(
            exportData.buy_confirm,
          )}, 
            ${dayjs(exportData.confirm_date).format('YYYY년 MM월 DD일')})`,
          icon: FaHamburger,
          iconColor: 'blue.500',
          disabled: !(exportData.confirm_date && exportData.buy_confirm !== 'none'),
        },
      ]}
    />
  );
}

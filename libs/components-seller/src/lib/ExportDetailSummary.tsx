import { SummaryList } from '@project-lc/components-core/SummaryList';
import { ExportRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { FaBoxOpen, FaCalendarAlt, FaHamburger, FaShippingFast } from 'react-icons/fa';

export interface ExportDetailSummaryProps {
  exportData: ExportRes;
}
export function ExportDetailSummary({
  exportData,
}: ExportDetailSummaryProps): JSX.Element {
  return (
    <SummaryList
      listItems={[
        {
          id: '출고등록일시',
          value: `출고 등록일시 ${dayjs(exportData.exportDate).format(
            'YYYY년 MM월 DD일 HH:mm:ss',
          )}`,
          icon: FaCalendarAlt,
        },
        {
          id: '배송 완료일',
          value: `배송 완료일 ${dayjs(exportData.shippingDoneDate).format(
            'YYYY년 MM월 DD일',
          )}`,
          icon: FaCalendarAlt,
          iconColor: 'blue.500',
          disabled: !exportData.shippingDoneDate,
        },
        {
          id: '택배사',
          value: `택배사 ${exportData.deliveryCompany}`,
          icon: FaBoxOpen,
        },
        {
          id: '송장번호',
          value: `송장번호 ${exportData.deliveryNumber}`,
          icon: FaShippingFast,
        },
        {
          id: '출고 상품 개수',
          value: `출고 상품 개수 ${exportData.items.length} 개`,
          icon: FaHamburger,
        },
        {
          id: '구매확정',
          value: `구매확정 (${exportData.buyConfirmSubject}), 
            ${dayjs(exportData.buyConfirmDate).format('YYYY년 MM월 DD일')})`,
          icon: FaHamburger,
          iconColor: 'blue.500',
          disabled: !(exportData.buyConfirmDate && exportData.buyConfirmSubject),
        },
      ]}
    />
  );
}
export default ExportDetailSummary;

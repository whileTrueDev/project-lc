import { List, ListItem, ListIcon } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FaBoxOpen, FaShippingFast } from 'react-icons/fa';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdDateRange, MdCheckCircle } from 'react-icons/md';
import {
  FmExportRes,
  convertFmDeliveryCompanyToString,
  convertFmExportConfirmStatusToString,
} from '@project-lc/shared-types';

export interface ExportDetailSummaryProps {
  exportData: FmExportRes;
}
export function ExportDetailSummary({ exportData }: ExportDetailSummaryProps) {
  return (
    <List spacing={2}>
      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={MdDateRange} color="green.500" />
        출고 등록일시 {dayjs(exportData.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
      </ListItem>

      {exportData.complete_date ? (
        <ListItem isTruncated>
          <ListIcon boxSize="1.5rem" as={MdDateRange} color="cyan.600" />
          출고 완료일 {dayjs(exportData.complete_date).format('YYYY년 MM월 DD일')}
        </ListItem>
      ) : null}

      {exportData.shipping_date ? (
        <ListItem isTruncated>
          <ListIcon boxSize="1.5rem" as={MdDateRange} color="blue.500" />
          배송 완료일 {dayjs(exportData.shipping_date).format('YYYY년 MM월 DD일')}
        </ListItem>
      ) : null}

      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={FaBoxOpen} color="green.500" />
        택배사 {convertFmDeliveryCompanyToString(exportData.delivery_company_code)}
      </ListItem>

      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={FaShippingFast} color="green.500" />
        송장번호 {exportData.delivery_number}
      </ListItem>

      <ListItem isTruncated>
        <ListIcon boxSize="1.5rem" as={IoFastFoodOutline} color="green.500" />
        출고 상품 개수 {exportData.items.length} 개
      </ListItem>

      {exportData.confirm_date && exportData.buy_confirm !== 'none' ? (
        <ListItem isTruncated>
          <ListIcon boxSize="1.5rem" as={MdCheckCircle} color="blue.500" />
          구매확정 ({convertFmExportConfirmStatusToString(exportData.buy_confirm)},{' '}
          {dayjs(exportData.confirm_date).format('YYYY년 MM월 DD일')})
        </ListItem>
      ) : null}
    </List>
  );
}

import { Badge, Box, Heading, HStack, Text } from '@chakra-ui/react';
import { FmExportRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { FmOrderStatusBadge } from './FmOrderStatusBadge';
import { TextDotConnector } from './TextDotConnector';

export interface ExportDetailTitleProps {
  exportData: FmExportRes;
}
export function ExportDetailTitle({ exportData }: ExportDetailTitleProps) {
  return (
    <Box>
      <Heading>출고 {exportData.export_code}</Heading>
      <HStack alignItems="center">
        <FmOrderStatusBadge orderStatus={exportData.status} />
        {/* 구매확정 배지 */}
        {exportData.confirm_date && exportData.buy_confirm !== 'none' ? (
          <Badge colorScheme="green">구매확정됨</Badge>
        ) : null}
        <TextDotConnector />
        <Text>{dayjs(exportData.export_date).fromNow()} 출고</Text>
      </HStack>
    </Box>
  );
}

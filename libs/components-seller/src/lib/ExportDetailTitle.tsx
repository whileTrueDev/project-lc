import { Badge, Box, Heading, HStack, Text } from '@chakra-ui/react';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { ExportRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';

export interface ExportDetailTitleProps {
  exportData: ExportRes;
}
export function ExportDetailTitle({ exportData }: ExportDetailTitleProps): JSX.Element {
  return (
    <Box>
      <Heading>출고 {exportData.exportCode}</Heading>
      <HStack alignItems="center">
        {exportData.exchangeExportedFlag && <Text fontSize="sm">(재출고)</Text>}
        <OrderStatusBadge step={exportData.status} />
        {/* 구매확정 배지 */}
        {exportData.buyConfirmDate && exportData.buyConfirmSubject ? (
          <Box>
            <Badge colorScheme="green">구매확정됨</Badge>
          </Box>
        ) : null}
        <TextDotConnector />
        <Text>{dayjs(exportData.exportDate).fromNow()} 출고</Text>
      </HStack>
    </Box>
  );
}

export default ExportDetailTitle;

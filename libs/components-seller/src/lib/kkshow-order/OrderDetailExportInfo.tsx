import { Box, Link, Stack, Text } from '@chakra-ui/react';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { DeliveryTrackingButton } from '@project-lc/components-shared/delivery-tracking/DeliveryTracking';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { ExportBaseData } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo } from 'react';
// import { OrderDetailOptionListItem } from './OrderDetailOptionList';

/** 주문 출고 정보 */
export function OrderDetailExportInfo({
  exportData,
}: {
  exportData: ExportBaseData;
}): JSX.Element {
  const totalExportedEa = useMemo(() => {
    return exportData.items.reduce((prev, curr) => {
      return prev + Number(curr.quantity);
    }, 0);
  }, [exportData.items]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <NextLink href={`/mypage/orders/exports/${exportData.exportCode}`} passHref>
          <Link isTruncated fontWeight="bold" textDecoration="underline">
            {exportData.exportCode}
          </Link>
        </NextLink>
        {exportData.exchangeExportedFlag && <Text fontSize="sm">(재출고)</Text>}
        <OrderStatusBadge step={exportData.status} />
        <TextDotConnector />
        <Text isTruncated>{getLocaleNumber(totalExportedEa)} 개</Text>
      </Stack>

      <DeliveryTrackingButton
        deliveryCompany={exportData.deliveryCompany}
        deliveryNumber={exportData.deliveryNumber}
        enableWarning
      />
      <Stack direction="row" flexWrap="wrap" spacing={1.5} alignItems="center">
        <Text>{exportData.deliveryCompany}</Text>
        <TextDotConnector />
        <Text>{exportData.deliveryNumber}</Text>
      </Stack>

      <Stack mt={2} spacing={1.5}>
        <Text>(출고일) {dayjs(exportData.exportDate).format('YYYY년 MM월 DD일')}</Text>
        {exportData.shippingDoneDate && (
          <Text>
            (배송완료일) {dayjs(exportData.shippingDoneDate).format('YYYY년 MM월 DD일')}
          </Text>
        )}
      </Stack>
    </Box>
  );
}

import NextLink from 'next/link';
import { Box, Link, Stack } from '@chakra-ui/react';
import { useFmOrder } from '@project-lc/hooks';
import { FmExportRes } from '@project-lc/shared-types';
import { OrderDetailExportInfoItem } from '..';

interface ExportDetailItemsProps {
  exportData: FmExportRes;
}
export function ExportDetailItems({ exportData }: ExportDetailItemsProps) {
  const order = useFmOrder(exportData.order_seq);
  return (
    <Box>
      <NextLink href={`/mypage/orders/${exportData.order_seq}`} passHref>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {exportData.order_seq}
        </Link>
      </NextLink>

      <Stack mt={2}>
        {exportData.items.map((item) => (
          <Box key={item.item_option_seq}>
            <Stack spacing={1}>
              <OrderDetailExportInfoItem
                itemOption={item}
                orderItems={order.data?.items || []}
                bundleExportCode={exportData.bundle_export_code}
              />
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

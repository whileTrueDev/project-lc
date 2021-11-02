import NextLink from 'next/link';
import { Box, Link, Stack } from '@chakra-ui/react';
import { useFmOrder } from '@project-lc/hooks';
import { FmExportRes } from '@project-lc/shared-types';
import { OrderDetailExportInfoItem } from '..';

interface ExportDetailItemsProps {
  exportData: FmExportRes;
}
export function ExportDetailItems({ exportData }: ExportDetailItemsProps): JSX.Element {
  const order = useFmOrder(exportData.order_seq);

  return (
    <Box>
      <Stack mt={2}>
        {exportData.items.map((item) => (
          <Box key={item.item_option_seq}>
            <NextLink href={`/mypage/orders/${item.order_seq}`} passHref>
              <Link isTruncated fontWeight="bold" textDecoration="underline">
                {item.order_seq}
              </Link>
            </NextLink>

            <OrderDetailExportInfoItem
              itemOption={item}
              orderItems={order.data?.items || []}
              bundleExportCode={exportData.bundle_export_code}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

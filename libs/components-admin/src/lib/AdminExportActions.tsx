import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { ExportRes } from '@project-lc/shared-types';
import PurchaseConfirmDialog from '@project-lc/components-web-kkshow/mypage/orderList/PurchaseConfirmDialog';
import { useMemo } from 'react';

export interface AdminExportActionsProps {
  exportData: ExportRes;
}
export function AdminExportActions({ exportData }: AdminExportActionsProps): JSX.Element {
  const purchaseConfirmDialog = useDisclosure();
  const orderItemOptionId = useMemo(
    () => exportData.items[0]?.orderItemOptionId,
    [exportData.items],
  );
  return (
    <Box>
      {exportData.status === 'shippingDone' && !exportData.buyConfirmDate && (
        <>
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={purchaseConfirmDialog.onOpen}
          >
            관리자권한으로 구매확정
          </Button>
          <PurchaseConfirmDialog
            isOpen={purchaseConfirmDialog.isOpen}
            onClose={purchaseConfirmDialog.onClose}
            orderItemOptionId={orderItemOptionId}
          />
        </>
      )}
    </Box>
  );
}

export default AdminExportActions;
